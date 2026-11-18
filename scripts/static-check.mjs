import ts from 'typescript';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
function walk(path){return readdirSync(path,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(path,e.name)): /\.tsx?$/.test(e.name)?[join(path,e.name)]:[]);}
let errors=0;const files=walk('src');
for(const f of files){let source=readFileSync(f,'utf8');let out=ts.transpileModule(source,{fileName:f,compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.Preserve},reportDiagnostics:true});for(const d of out.diagnostics??[]){if(d.category===ts.DiagnosticCategory.Error){console.error(`${f}: ${ts.flattenDiagnosticMessageText(d.messageText,' ')}`);errors++;}}}
for(const path of ['db/001_init.sql','db/002_safety.sql','src/app/api/orders/route.ts','src/lib/authRateLimit.ts'])if(!existsSync(path)){console.error(`Missing ${path}`);errors++;}
console.log(`Syntax checked ${files.length} TS/TSX files: ${errors} errors`);
if(errors)process.exitCode=1;
