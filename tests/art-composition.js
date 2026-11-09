'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const h=fs.readFileSync('index.html','utf8');
for(const id of ['s1','s4','s9','s10','s13','s15']){
 const section=h.match(new RegExp('<section class="screen" id="'+id+'"[\\s\\S]*?<\\/section>'))[0];
 const lead=section.match(/<div class="visual-lead">([\s\S]*?)<\/div><!--\/visual-lead-->/);
 assert.ok(lead,id+' integrates image with headline');
 assert.match(lead[1],/<h1/);assert.match(lead[1],/<figure/);
 assert.doesNotMatch(lead[1],/class="(?:g g2|g g3|tlflow)"/,'Data and content keep full width');
}
assert.match(h,/<div class="cmp-s"[^>]*>\s*<figure class="editorial-side-art"/,'Wardrobe belongs inside cosmetic comparison');
console.log('Art composed into editorial leads and cosmetic example; data stays full-width.');
