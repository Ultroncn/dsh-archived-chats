// Test-only fixture builder for data produced by earlier releases. Never shipped.
// New public /delete requests are tested separately and must return 410 without permanent:true.
import { join } from 'node:path';
import { createSnapshotStore } from '../../lib/snapshot.js';
import { createTrashStore } from '../../lib/trash.js';
import { createMetadataStore } from '../../lib/metadata.js';
import { resolvePersistenceCompat } from '../../lib/persistence-compat.js';
export async function seedLegacyRecord({sessionId,persistence,snapshotStore,trashStore,metadataStore}) {
 const inspected=await (persistence.readSession??persistence.inspect).call(persistence,sessionId);
 const metadata=await metadataStore.getMany([sessionId]);
 const entry=metadata.entries?.[sessionId];
 const archive={title:inspected.events.findLast(event=>event.type==='session/title')?.data?.title??null,
  createdAt:inspected.meta.createdAt??null,origin:inspected.meta.origin??null,workspace:null,wasArchived:true,
  tags:entry?.tags??[],note:entry?.note??'',metadataUpdatedAt:entry?.updatedAt??null};
 const snapshot=await snapshotStore.capture({sessionId,archive,liveDisposition:'cold'});
 await trashStore.put({sessionId,state:'trashed',trashedAt:new Date().toISOString(),purgeRequestedAt:null,...archive,
  snapshotId:snapshot.snapshotId,snapshotBytes:snapshot.bytes,snapshotAttachmentCount:snapshot.attachmentCount,liveDisposition:'cold'});
}
export function withLegacyFixtures(apply) {
 return ctx => {
  let seeded=false;
  const bind=()=>{
   const server=ctx.get('webServer');const registry=ctx.get('workspaceRegistry');const raw=ctx.get('sessionPersistence');
   if(seeded||!server||!registry||!raw)return;seeded=true;
   const persistence=resolvePersistenceCompat(raw);const root=join(process.env.DSH_HOME,'plugin-data','archived-chats');
   const snapshotStore=createSnapshotStore({root:join(root,'snapshots'),persistence,attachments:ctx.get('attachments')});
   const trashStore=createTrashStore({path:join(root,'trash.json')});
   const metadataStore=createMetadataStore({filePath:join(root,'metadata.json')});
   server.register({path:'/plugins/dsh-archived-chats/__test_seed_legacy_trash',handler:async(req,res)=>{
    const body=await new Promise((resolve,reject)=>{const parts=[];req.on('data',c=>parts.push(c));req.on('end',()=>{try{resolve(JSON.parse(Buffer.concat(parts).toString()))}catch(e){reject(e)}});req.on('error',reject)});
    const trashed=[];const failed=[];
    for(const sessionId of new Set(body.sessionIds??[body.sessionId])){
     try{
      await seedLegacyRecord({sessionId,persistence,snapshotStore,trashStore,metadataStore});
      trashed.push(sessionId);
     }catch(error){failed.push({id:sessionId,reason:error.code??'legacy-fixture-failed'});}
    }
    const result={trashed,failed};res.writeHead(failed.length?409:200);res.end(JSON.stringify({ok:!failed.length,...result}));
   }});
  };
  apply({...ctx,on(event,callback){ctx.on(event,(...args)=>{callback(...args);bind()})}});bind();
 };
}
