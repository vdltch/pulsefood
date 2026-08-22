type Bucket={count:number;resetAt:number};
const buckets=new Map<string,Bucket>();
export function clientIp(headers:Headers){return (headers.get("x-forwarded-for")||headers.get("x-real-ip")||"unknown").split(",")[0].trim().slice(0,64)}
export function rateLimit(key:string,limit:number,windowMs:number,now=Date.now()){const current=buckets.get(key);if(!current||current.resetAt<=now){buckets.set(key,{count:1,resetAt:now+windowMs});return {allowed:true,remaining:limit-1,retryAfter:0}}current.count+=1;if(buckets.size>5000)for(const [name,bucket] of buckets)if(bucket.resetAt<=now)buckets.delete(name);return {allowed:current.count<=limit,remaining:Math.max(0,limit-current.count),retryAfter:Math.ceil((current.resetAt-now)/1000)}}
export function sameOrigin(request:Request){const origin=request.headers.get("origin");if(!origin)return true;try{return new URL(origin).host===new URL(request.url).host}catch{return false}}
export function tooManyRequests(retryAfter:number){return Response.json({error:"Trop de requêtes. Réessaie dans quelques instants."},{status:429,headers:{"Retry-After":String(retryAfter),"Cache-Control":"no-store"}})}
export function resetRateLimitsForTests(){buckets.clear()}
