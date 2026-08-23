import {auth} from "@/auth";
export async function memberId(){const session=await auth();return (session?.user as {id?:string}|undefined)?.id||null}
