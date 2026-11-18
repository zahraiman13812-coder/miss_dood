// Apply initial sample catalog without overwriting live inventory or prices.
import pg from "pg";
import {readFileSync} from "node:fs";
const db=new pg.Client({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL === "true" ? {rejectUnauthorized:true}:undefined});
const products=[
 ["classic-lighter","lighters","فندک کلاسیک","/images/categories/lighters.webp",320000,"طرح فندک درب‌دار با بدنهٔ مستطیلی."],
 ["hookah-set","hookah","قلیون پایه‌دار","/images/categories/hookah.webp",1850000,"طرح قلیون پایه‌دار با شلنگ و سینی."],
 ["cube-charcoal","charcoal","ذغال مکعبی","/images/categories/charcoal.webp",95000,"نمایی از فرم مکعبی ذغال."],
 ["lighter-fuel","fuel","بنزین فندک","/images/categories/fuel.webp",145000,"طرح بطری سوخت مخصوص فندک."]
];
await db.connect();try{
 for(const [slug,category,name,image,price,description] of products)await db.query("INSERT INTO products(slug,category,name,image,price_toman,description,stock) VALUES($1,$2,$3,$4,$5,$6,0) ON CONFLICT(slug) DO NOTHING",[slug,category,name,image,price,description]);
 console.log("Seed complete; stock intentionally zero. Add stock and shipping from admin panel.");
}finally{await db.end();}
