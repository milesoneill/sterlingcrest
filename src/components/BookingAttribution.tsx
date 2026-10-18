import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {getSeoPageByPath} from '@/lib/seo-content';
import {trackBookingEvent,visitForBooking} from '@/lib/booking-attribution';
export default function BookingAttribution(){
  const {pathname,search}=useLocation();
  useEffect(()=>{
    visitForBooking(pathname,search);
    if(getSeoPageByPath(pathname))trackBookingEvent('guide_view',pathname);
    if(pathname==='/book')trackBookingEvent('booking_opened',pathname);
  },[pathname,search]);
  useEffect(()=>{
    function clicked(event:MouseEvent){
      const anchor=event.target instanceof Element?event.target.closest('a'):null;
      if(!anchor)return;
      try{const url=new URL(anchor.href,window.location.href);if(url.origin===window.location.origin&&url.pathname==='/book')trackBookingEvent('booking_cta');}catch{/* Ignore malformed links. */}
    }
    document.addEventListener('click',clicked,true);
    return()=>document.removeEventListener('click',clicked,true);
  },[]);
  return null;
}
