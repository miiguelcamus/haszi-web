(function(){
 var root=document.documentElement,body=document.body;
 function lang(){return root.classList.contains('eu')?'eu':'es'}

 // language
 document.querySelectorAll('.lang button').forEach(function(b){
  b.addEventListener('click',function(){
   var l=b.dataset.set;root.classList.toggle('eu',l==='eu');root.lang=l;
   try{localStorage.setItem('hz-lang',l)}catch(e){}
   try{var u=new URL(location.href);if(l==='eu')u.searchParams.set('lang','eu');else u.searchParams.delete('lang');history.replaceState(null,'',u)}catch(e){}
   updateOpen();
  });
 });

 // header shadow
 var top=document.querySelector('.top');
 function onScroll(){top.classList.toggle('sc',window.scrollY>8)}
 window.addEventListener('scroll',onScroll,{passive:true});onScroll();

 // mobile menu
 var burger=document.querySelector('.burger'),mm=document.querySelector('.mmenu');
 if(burger){burger.addEventListener('click',function(){
  var o=!body.classList.contains('menu-open');body.classList.toggle('menu-open',o);root.classList.toggle('menu-open',o);
  burger.setAttribute('aria-expanded',o);mm.setAttribute('aria-hidden',!o);
 });}

 // page transition for internal links
 document.querySelectorAll('a[href$=".html"],a[href*=".html?"],a[href*=".html#"]').forEach(function(a){
  a.addEventListener('click',function(e){
   if(e.metaKey||e.ctrlKey||a.target==='_blank')return;
   var href=a.getAttribute('href');
   if(href.split('#')[0].split('?')[0]===location.pathname.split('/').pop()&&href.indexOf('#')>-1)return;
   e.preventDefault();body.classList.add('leaving');
   var u=href;if(lang()==='eu'&&u.indexOf('lang=')<0){u=u.replace('.html?','.html?lang=eu&')}
   setTimeout(function(){location.href=u},220);
  });
 });
 window.addEventListener('pageshow',function(){body.classList.remove('leaving')});

 // reveal
 var els=document.querySelectorAll('.rv');
 if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -50px 0px'});
  els.forEach(function(e){io.observe(e)});
 } else els.forEach(function(e){e.classList.add('in')});

 // open now
 function updateOpen(){
  var H=window.HZ_HOURS||[];var now=new Date();var d=now.getDay();var idx=(d+6)%7;var h=H[idx];
  var mins=now.getHours()*60+now.getMinutes();
  function m(t){var p=t.split(':');return +p[0]*60+ +p[1]}
  var open=h&&h[0]&&mins>=m(h[0])&&mins<m(h[1]);
  var txt=open?(lang()==='eu'?'Orain irekita · '+h[1]+'ak arte':'Abierto ahora · hasta las '+h[1]):(lang()==='eu'?'Orain itxita':'Cerrado ahora');
  document.querySelectorAll('[data-open]').forEach(function(e){e.textContent=txt;e.classList.toggle('is-open',!!open)});
  var li=document.querySelector('.hours li[data-d="'+d+'"]');if(li)li.classList.add('today');
 }
 updateOpen();setInterval(updateOpen,60000);

 // service CTAs with prefilled WhatsApp
 document.querySelectorAll('.svc-cta').forEach(function(a){
  a.addEventListener('click',function(){
   var s=lang()==='eu'?a.dataset.svcEu:a.dataset.svcEs;
   var t=lang()==='eu'?'Kaixo! Hitzordua eskatu nahi nuke: '+s:'¡Hola! Quería pedir cita para: '+s;
   a.href=window.HZ_WA+'?text='+encodeURIComponent(t);
  });
 });

 // finder
 var chips=document.querySelectorAll('.fc'),res=document.querySelector('.fres');
 chips.forEach(function(c){
  c.addEventListener('click',function(){
   chips.forEach(function(x){x.classList.toggle('on',x===c)});
   var ids=c.dataset.t.split(',');
   document.querySelectorAll('.sv').forEach(function(s){s.classList.toggle('hit',ids.indexOf(s.id)>-1)});
   var names=ids.map(function(id){var h=document.querySelector('#'+id+' h2 [data-l="'+lang()+'"]');return '<a href="#'+id+'">'+(h?h.textContent:id)+'</a>'});
   res.innerHTML=(lang()==='eu'?'Zuretzat egokia: ':'Te encaja: ')+names.join(' · ');
   var first=document.getElementById(ids[0]);
   if(first)setTimeout(function(){first.scrollIntoView({behavior:'smooth',block:'center'})},250);
  });
 });
 if(location.hash){var t=document.querySelector(location.hash);if(t&&t.classList.contains('sv')){t.classList.add('hit');setTimeout(function(){t.classList.remove('hit')},2600)}}

 // gallery lightbox
 var lb=document.querySelector('.lb');
 if(lb){
  var li2=lb.querySelector('img');
  document.querySelectorAll('.gi').forEach(function(g){g.addEventListener('click',function(){li2.src=g.dataset.full;lb.classList.add('on');lb.setAttribute('aria-hidden','false')})});
  function close(){lb.classList.remove('on');lb.setAttribute('aria-hidden','true')}
  lb.addEventListener('click',function(e){if(e.target!==li2)close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 }

 // WhatsApp composer
 var f=document.querySelector('.wform');
 if(f){f.addEventListener('submit',function(e){
  e.preventDefault();
  var eu=lang()==='eu';var n=f.n.value.trim();var sel=f.s.options[f.s.selectedIndex];
  var s=sel&&sel.value!==''?(eu?sel.dataset.eu:sel.dataset.es):'';
  var t=f.querySelector('input[name=t]:checked').value;
  var when={m:eu?'goizean':'por la mañana',a:eu?'arratsaldean':'por la tarde',x:eu?'edozein momentutan':'cuando sea'}[t];
  var msg=eu?('Kaixo! '+(n?n+' naiz. ':'')+'Hitzordua eskatu nahi nuke'+(s?' ('+s+')':'')+', '+when+'.'):('¡Hola! '+(n?'Soy '+n+'. ':'')+'Quería pedir cita'+(s?' para '+s.toLowerCase():'')+', '+when+'.');
  if(f.m.value.trim())msg+='\n'+f.m.value.trim();
  window.open(window.HZ_WA+'?text='+encodeURIComponent(msg),'_blank','noopener');
 });}
})();
