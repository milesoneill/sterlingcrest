import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
let tracking:typeof import('@/lib/booking-attribution');
const guide='/resources/final-expense-insurance-waiting-period';
beforeEach(async()=>{sessionStorage.clear();vi.resetModules();vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({accepted:true})));tracking=await import('@/lib/booking-attribution');});
afterEach(()=>{vi.unstubAllGlobals();});
describe('private booking source and funnel',()=>{
  it('retains the guide and search source through navigation and a page reload',async()=>{
    tracking.visitForBooking(guide,'?email=private@example.invalid&utm_source=google&utm_medium=organic&utm_campaign=PrivateName','https://google.com/search?q=private');
    tracking.visitForBooking('/book','');
    expect(tracking.bookingAttribution()).toMatchObject({landingPath:guide,articlePath:guide,source:'google',medium:'organic'});
    vi.resetModules();tracking=await import('@/lib/booking-attribution');tracking.visitForBooking('/book','');
    expect(tracking.bookingAttribution().articlePath).toBe(guide);
    expect(JSON.stringify(tracking.bookingAttribution())).not.toMatch(/private|PrivateName|campaign|email/);
  });
  it('sends only allowlisted paths and event fields once per browser session and page',()=>{
    tracking.visitForBooking(guide,'','');tracking.trackBookingEvent('guide_view',guide);tracking.trackBookingEvent('guide_view',guide);tracking.trackBookingEvent('booking_cta',guide);
    const calls=vi.mocked(fetch).mock.calls;expect(calls).toHaveLength(2);
    expect(JSON.parse(String(calls[0][1]?.body))).toEqual({action:'track',name:'guide_view',path:guide,attribution:tracking.bookingAttribution()});
    expect(tracking.publicTrackingPath('/resources/a-person-email@private.com')).toBeUndefined();
    expect(tracking.publicTrackingPath('/book?phone=2025550147')).toBeUndefined();
  });
  it('maps unknown sources to a category without storing raw referrer hosts or campaign text',()=>{
    expect(tracking.trafficSource('?utm_source=private@example.invalid&utm_campaign=PrivateName','')).toEqual({source:'other',medium:'other'});
    expect(tracking.trafficSource('','https://person.private-domain.example/path?secret=yes')).toEqual({source:'referral',medium:'referral'});
  });
  it('respects browser privacy controls and does not interfere with booking',()=>{
    vi.stubGlobal('navigator',{doNotTrack:'1'});tracking.visitForBooking(guide,'','');tracking.trackBookingEvent('guide_view',guide);
    expect(fetch).not.toHaveBeenCalled();expect(tracking.bookingAttribution()).toEqual({});
  });
  it('continues with memory attribution when browser storage is unavailable',()=>{
    vi.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new Error('blocked');});vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked');});
    tracking.visitForBooking(guide,'','');tracking.visitForBooking('/book','','');expect(tracking.bookingAttribution().articlePath).toBe(guide);vi.restoreAllMocks();
  });
});
