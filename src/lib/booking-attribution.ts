import { getSeoPageByPath } from './seo-content';
import { staticRoutes } from './site-routes';
import { services } from './services';
export type BookingAttribution={landingPath?:string;articlePath?:string;source?:string;medium?:string;sessionId?:string};
type Session={attribution:BookingAttribution;updatedAt:number;sent:string[]};
export type FunnelEvent='guide_view'|'booking_opened'|'booking_cta'|'time_selected'|'booking_error';
const key='scf.booking-attribution.v1';
let memory:Session|null=null;
const sourceNames=new Set(['google','bing','yahoo','duckduckgo','facebook','instagram','linkedin','youtube']);
const mediumNames=new Set(['organic','cpc','paid_social','social','email','referral']);
const storedSources=new Set([...sourceNames,'direct','referral','other']);
const storedMedia=new Set([...mediumNames,'none','other']);
export function publicTrackingPath(path:string) {
  const clean=path.replace(/\/$/,'')||'/';
  return staticRoutes.includes(clean)||getSeoPageByPath(clean)||services.some(s=>`/services/${s.slug}`===clean) ? clean : undefined;
}
function optedOut(){return typeof window==='undefined'||navigator.doNotTrack==='1'||(window as Window & {globalPrivacyControl?:boolean}).globalPrivacyControl===true;}
export function trafficSource(search:string,referrer:string) {
  const params=new URLSearchParams(search), source=params.get('utm_source')?.toLowerCase(),medium=params.get('utm_medium')?.toLowerCase();
  if(source || medium) return {source:sourceNames.has(source??'')?source!:'other',medium:mediumNames.has(medium??'')?medium!:'other'};
  try {
    const host=new URL(referrer).hostname.replace(/^www\./,'');
    if(['sterlingcrestfinancial.com','crm.sterlingcrestfinancial.com'].includes(host)) return {source:'direct',medium:'none'};
    for(const search of ['google','bing','yahoo','duckduckgo']) if(host===`${search}.com` || host.endsWith(`.${search}.com`)) return {source:search,medium:'organic'};
    for(const social of ['facebook','instagram','linkedin','youtube']) if(host===`${social}.com`||host.endsWith(`.${social}.com`)) return {source:social,medium:'social'};
    return {source:'referral',medium:'referral'};
  } catch {return {source:'direct',medium:'none'};}
}
function persist(){try {sessionStorage.setItem(key,JSON.stringify(memory));}catch{/* Attribution must never block booking. */}}
export function visitForBooking(path:string,search=window.location.search,referrer=document.referrer) {
  if(optedOut()) return;
  const clean=publicTrackingPath(path);if(!clean)return;
  if(!memory){try{memory=JSON.parse(sessionStorage.getItem(key)||'null');}catch{memory=null;}}
  const now=Date.now();
  if(!memory || !Array.isArray(memory.sent) || !memory.attribution?.sessionId || now-memory.updatedAt>30*60_000) {
    memory={attribution:{sessionId:crypto.randomUUID(),landingPath:clean,...trafficSource(search,referrer)},updatedAt:now,sent:[]};
  }
  if(getSeoPageByPath(clean)) memory.attribution.articlePath=clean;
  memory.updatedAt=now;persist();
}
export function bookingAttribution():BookingAttribution {
  if(optedOut())return {};
  if(!memory)return {};
  const raw=memory.attribution,result:BookingAttribution={};
  if(typeof raw.sessionId==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(raw.sessionId))result.sessionId=raw.sessionId;
  if(typeof raw.landingPath==='string')result.landingPath=publicTrackingPath(raw.landingPath);
  if(typeof raw.articlePath==='string'&&getSeoPageByPath(raw.articlePath))result.articlePath=raw.articlePath;
  if(storedSources.has(raw.source))result.source=raw.source;
  if(storedMedia.has(raw.medium))result.medium=raw.medium;
  return result;
}
export function trackBookingEvent(name:FunnelEvent,path=window.location.pathname) {
  if(optedOut())return;
  const clean=publicTrackingPath(path);if(!clean)return;
  if(!memory)visitForBooking(clean);
  if(!memory)return;
  const token=`${name}:${clean}`;if(memory.sent.includes(token))return;
  // Explicit field allowlist: no form values, timestamps, query strings,
  // referrer URL, appointment time, request ID or error text enter analytics.
  const body=JSON.stringify({action:'track',name,path:clean,attribution:bookingAttribution()});
  memory.sent.push(token);persist();
  void fetch('/api/booking',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).then(response=>{
    if(!response.ok && memory){memory.sent=memory.sent.filter(item=>item!==token);persist();}
  }).catch(()=>{if(memory){memory.sent=memory.sent.filter(item=>item!==token);persist();}});
}
