/* RYVT theme behaviours */
(function(){
"use strict";
var CAN_HOVER=matchMedia("(hover:hover) and (pointer:fine)").matches;

/* ---- mega menu ---- */

/* ---- search panel ---- */

/* ---- accordions ---- */
function initRows(root){
  (root||document).querySelectorAll("[data-row]").forEach(function(row){
    var n=row.children.length; if(!n) return;
    var max=parseInt(row.dataset.max||"4",10);
    row.style.gridTemplateColumns="repeat("+Math.min(max,Math.max(2,n))+",1fr)";
  });
}

/* ---- accordions ---- */
function initAcc(root){
  (root||document).querySelectorAll(".acc").forEach(function(a){
    if(a.dataset.w) return; a.dataset.w="1";
    var h=a.querySelector(".acc-h"), b=a.querySelector(".acc-b"); if(!h||!b) return;
    h.addEventListener("click",function(){
      var on=a.classList.toggle("on");
      b.style.maxHeight = on ? b.scrollHeight+"px" : "0px";
      h.setAttribute("aria-expanded", on ? "true" : "false");
    });
  });
}

/* ---- product page ---- */
function initProduct(root){
  (root||document).querySelectorAll("[data-picker]").forEach(function(box){
    if(box.dataset.w) return; box.dataset.w="1";
    var data=box.querySelector("[data-variants]"); if(!data) return;
    var variants=JSON.parse(data.textContent);
    function sync(){
      var chosen=[];
      box.querySelectorAll("[data-opt]").forEach(function(row){
        var on=row.querySelector(".on"); chosen.push(on?on.dataset.value:null);
      });
      var match=null;
      for(var i=0;i<variants.length;i++){
        var v=variants[i], ok=true;
        for(var j=0;j<chosen.length;j++){ if(chosen[j]!==null && v.options[j]!==chosen[j]) ok=false; }
        if(ok){ match=v; break; }
      }
      var idEl=box.querySelector('input[name="id"]'), btn=box.querySelector("[data-add]"),
          price=document.querySelector("[data-price]"), lbl=document.querySelector("[data-colour-label]"),
          media=document.querySelector("[data-main-image]");
      if(match){
        if(idEl) idEl.value=match.id;
        if(price&&match.price) price.innerHTML=match.price;
        if(btn){ btn.disabled=!match.available; btn.textContent=match.available?"Add to Bag":"Sold Out"; }
        if(media&&match.image) media.src=match.image;
      } else if(btn){ btn.disabled=true; btn.textContent="Unavailable"; }
      if(lbl&&chosen[0]) lbl.textContent=chosen[0];
    }
    box.querySelectorAll("[data-opt]").forEach(function(row){
      row.addEventListener("click",function(e){
        var b=e.target.closest("[data-value]"); if(!b) return;
        row.querySelectorAll("[data-value]").forEach(function(x){x.classList.remove("on");});
        b.classList.add("on"); sync();
      });
    });
    sync();
  });
  var q=(root||document).querySelector("[data-qty]");
  if(q && !q.dataset.w){
    q.dataset.w="1";
    var inp=q.querySelector("input");
    q.querySelector("[data-minus]").addEventListener("click",function(){
      inp.value=Math.max(1,(parseInt(inp.value,10)||1)-1); });
    q.querySelector("[data-plus]").addEventListener("click",function(){
      inp.value=(parseInt(inp.value,10)||1)+1; });
  }
  (root||document).querySelectorAll("[data-thumb]").forEach(function(b){
    b.addEventListener("click",function(){
      var main=document.querySelector("[data-main-image]");
      if(main) main.src=b.dataset.thumb;
      document.querySelectorAll("[data-thumb]").forEach(function(x){x.classList.remove("on");});
      b.classList.add("on");
    });
  });
}

/* ---- wishlist toggles ---- */
function initFav(root){
  (root||document).querySelectorAll(".pc-fav").forEach(function(b){
    if(b.dataset.w) return; b.dataset.w="1";
    b.addEventListener("click",function(e){
      e.preventDefault(); e.stopPropagation();
      var id=b.getAttribute("data-fav-id")||b.closest("[data-pid]")&&b.closest("[data-pid]").getAttribute("data-pid");
      var on;
      if(id && window.__ryvtSaved){ on=window.__ryvtSaved.toggle(id); }
      else { on=!b.classList.contains("on"); }
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });
}

/* ---- reveal ---- */
var io=("IntersectionObserver" in window)?new IntersectionObserver(function(en){
  en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
},{rootMargin:"0px 0px -6% 0px",threshold:0}):null;
function observe(root){
  if(!io) return;
  (root||document).querySelectorAll("[data-rv]:not(.in), .stag:not(.in)").forEach(function(el){io.observe(el);});
}

function initBands(root){
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var bands=[].slice.call((root||document).querySelectorAll("[data-mband-par]:not(.par-on)"));
  if(!bands.length) return;
  bands.forEach(function(b){ b.classList.add("par-on"); });
  if(!window.__ryvtPar){
    window.__ryvtPar=[];
    var ticking=false;
    function frame(){
      var vh=window.innerHeight;
      window.__ryvtPar.forEach(function(b){
        var r=b.getBoundingClientRect();
        if(r.bottom<-100||r.top>vh+100) return;
        var m=b.querySelector(".mband-m");
        if(!m) return;
        var prog=(r.top+r.height/2-vh/2)/vh;
        m.style.transform="translate3d(0,"+(prog*-7).toFixed(2)+"%,0) scale(1.14)";
      });
      ticking=false;
    }
    window.addEventListener("scroll",function(){ if(!ticking){ ticking=true; requestAnimationFrame(frame); } },{passive:true});
    window.addEventListener("resize",frame);
    frame();
  }
  window.__ryvtPar=window.__ryvtPar.concat(bands);
}
function boot(root){ initRows(root); initAcc(root); initProduct(root); initFav(root); initBands(root); observe(root); }
document.addEventListener("DOMContentLoaded",function(){ initHeader(); initPanels(); boot(document); });
document.addEventListener("shopify:section:load",function(e){ initHeader(); initPanels(); boot(e.target); });

/* ================= HEADER ================= */
function closeSearch(){
  var s=document.getElementById("search"), h=document.getElementById("hdr");
  if(s) s.classList.remove("on");
  var b=document.getElementById("searchBtn"); if(b) b.setAttribute("aria-expanded","false");
  document.body.classList.remove("search-open");
  if(h) h.classList.remove("panel-open");
  var sc=document.getElementById("scrim");
  if(sc && !document.body.classList.contains("mega-open")) sc.classList.remove("on");
  if(window.__hdrSync) window.__hdrSync();
}
function closeDrawer(){
  var d=document.getElementById("drawer"); if(d) d.classList.remove("on");
  var b=document.getElementById("burger");
  if(b) b.setAttribute("aria-expanded","false");
  document.body.classList.remove("drawer-open","no-scroll");
  var sc=document.getElementById("scrim");
  if(sc && !document.body.classList.contains("search-open") && !document.body.classList.contains("mega-open"))
    sc.classList.remove("on");
}

function initHeader(){
  var hdr=document.getElementById("hdr"); if(!hdr || hdr.dataset.ready) return;
  hdr.dataset.ready="1";
  var mega=document.getElementById("mega"),
      scrim=document.getElementById("scrim"),
      abar=document.getElementById("abar"),
      t=null, lastY=0;

  /* --- transparent-over-hero --- */
  var wantClear = hdr.dataset.clear === "true";
  var main=document.getElementById("main");
  var firstSec = main && main.firstElementChild;
  var hasHero = !!(firstSec && firstSec.querySelector && (firstSec.querySelector(".hero,.mband") || firstSec.matches(".hero,.mband")));
  var clearMode = wantClear && hasHero;
  function measure(){
    document.documentElement.style.setProperty("--hdr-h", hdr.offsetHeight+"px");
  }
  if(clearMode){ document.body.classList.add("has-clear-hdr"); measure(); }
  window.addEventListener("resize", measure);

  function threshold(){
    if(!clearMode) return 0;
    var el = main && main.firstElementChild;
    var h = el ? el.offsetHeight : 0;
    return Math.max(80, h - hdr.offsetHeight - 40);
  }
  function sync(){
    if(!clearMode) return;
    var open = document.body.classList.contains("mega-open") || document.body.classList.contains("search-open");
    hdr.classList.toggle("is-clear", !open && window.scrollY < threshold());
  }
  window.__hdrSync = sync;

  /* --- auto-hide on scroll down --- */
  var autohide = hdr.dataset.autohide === "true";
  var ticking=false;
  function onScroll(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(function(){
      var y=window.scrollY;
      if(autohide){
        var busy = document.body.classList.contains("mega-open") ||
                   document.body.classList.contains("search-open") ||
                   document.body.classList.contains("drawer-open");
        hdr.classList.toggle("up", !busy && y > lastY && y > 260);
      }
      lastY = y;
      sync();
      ticking=false;
    });
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", sync);
  sync();

  /* --- mega menu --- */
  function closeMega(){
    if(mega) mega.classList.remove("open");
    hdr.querySelectorAll(".mega-in").forEach(function(m){ m.classList.remove("show"); });
    hdr.querySelectorAll(".nav-i[data-menu]").forEach(function(a){ a.setAttribute("aria-expanded","false"); });
    document.body.classList.remove("mega-open");
    hdr.classList.remove("panel-open");
    if(scrim && !document.body.classList.contains("search-open")) scrim.classList.remove("on");
    sync();
  }
  function openMega(btn){
    clearTimeout(t);
    if(!mega) return;
    closeSearch();
    mega.classList.add("open");
    hdr.querySelectorAll(".mega-in").forEach(function(m){ m.classList.toggle("show", m.id===btn.dataset.menu); });
    hdr.querySelectorAll(".nav-i[data-menu]").forEach(function(a){
      a.setAttribute("aria-expanded", a===btn ? "true" : "false");
    });
    document.body.classList.add("mega-open");
    hdr.classList.add("panel-open");
    hdr.classList.remove("up");
    if(scrim) scrim.classList.add("on");
    sync();
  }
  hdr.querySelectorAll(".nav-i[data-menu]").forEach(function(btn){
    btn.addEventListener("pointerenter", function(){ if(CAN_HOVER) openMega(btn); });
    btn.addEventListener("click", function(e){
      e.preventDefault();
      if(btn.getAttribute("aria-expanded")==="true") closeMega(); else openMega(btn);
    });
    btn.addEventListener("keydown", function(e){
      if(e.key==="Enter"||e.key===" "){ e.preventDefault(); openMega(btn); }
      if(e.key==="ArrowDown"){
        e.preventDefault(); openMega(btn);
        var first=document.getElementById(btn.dataset.menu);
        first=first&&first.querySelector("a"); if(first) first.focus();
      }
    });
  });
  if(CAN_HOVER){
    hdr.addEventListener("pointerleave", function(){ t=setTimeout(closeMega,180); });
    hdr.addEventListener("pointerenter", function(){ clearTimeout(t); });
  }
  document.addEventListener("focusin", function(e){
    if(document.body.classList.contains("mega-open") && !hdr.contains(e.target)) closeMega();
  });
  if(scrim) scrim.addEventListener("click", function(){ closeMega(); closeSearch(); closeDrawer(); });
  document.addEventListener("keydown", function(e){
    if(e.key==="Escape"){ closeMega(); closeSearch(); closeDrawer(); }
  });
  window.__ryvtCloseMega = closeMega;

  /* --- announcement bar --- */
  if(abar){
    var items=abar.querySelectorAll(".abar-i"), secs=parseInt(abar.dataset.rotate||"0",10), i=0;
    if(items.length>1 && secs>0 && !matchMedia("(prefers-reduced-motion: reduce)").matches){
      setInterval(function(){
        items[i].classList.remove("on");
        i=(i+1)%items.length;
        items[i].classList.add("on");
      }, secs*1000);
    }
    var ax=document.getElementById("abarX");
    if(ax) ax.addEventListener("click", function(){
      abar.classList.add("gone");
      try{ sessionStorage.setItem("ryvt-abar","0"); }catch(e){}
      sync();
    });
    try{ if(sessionStorage.getItem("ryvt-abar")==="0") abar.classList.add("gone"); }catch(e){}
  }
}

function initPanels(){
  var s=document.getElementById("search"),
      hdr=document.getElementById("hdr"),
      sc=document.getElementById("scrim"),
      btn=document.getElementById("searchBtn");
  if(btn && s && !btn.dataset.ready){
    btn.dataset.ready="1";
    btn.addEventListener("click", function(){
      if(s.classList.contains("on")){ closeSearch(); return; }
      if(window.__ryvtCloseMega) window.__ryvtCloseMega();
      s.classList.add("on");
      btn.setAttribute("aria-expanded","true");
      document.body.classList.add("search-open");
      if(hdr){ hdr.classList.add("panel-open"); hdr.classList.remove("up","is-clear"); }
      if(sc) sc.classList.add("on");
      setTimeout(function(){ var i=document.getElementById("sInput"); if(i) i.focus(); }, 260);
    });
  }
  var inp=document.getElementById("sInput"), clr=document.getElementById("sClear");
  if(inp && clr && !clr.dataset.ready){
    clr.dataset.ready="1";
    function tog(){ clr.classList.toggle("on", inp.value.length>0); }
    inp.addEventListener("input", tog);
    clr.addEventListener("click", function(){ inp.value=""; tog(); inp.focus(); });
    tog();
  }

  var b=document.getElementById("burger"), d=document.getElementById("drawer");
  if(b && d && !b.dataset.ready){
    b.dataset.ready="1";
    b.addEventListener("click", function(){
      if(d.classList.contains("on")){ closeDrawer(); return; }
      if(window.__ryvtCloseMega) window.__ryvtCloseMega();
      closeSearch();
      d.classList.add("on");
      b.setAttribute("aria-expanded","true");
      document.body.classList.add("drawer-open","no-scroll");
      if(sc) sc.classList.add("on");
    });
  }
  var dx=document.getElementById("drawerX");
  if(dx && !dx.dataset.ready){ dx.dataset.ready="1"; dx.addEventListener("click", closeDrawer); }

  document.querySelectorAll("[data-sub]").forEach(function(t){
    if(t.dataset.ready) return; t.dataset.ready="1";
    t.addEventListener("click", function(){
      var el=document.getElementById(t.dataset.sub); if(!el) return;
      var open = el.style.maxHeight && el.style.maxHeight!=="0px";
      el.style.maxHeight = open ? "0px" : el.scrollHeight+"px";
      t.setAttribute("aria-expanded", open ? "false" : "true");
      var sp=t.querySelector("span"); if(sp) sp.textContent = open ? "+" : "–";
    });
  });

  /* saved-items counter */
  var badges=document.querySelectorAll("[data-saved-count]");
  if(badges.length){
    function readSaved(){
      try{ return JSON.parse(localStorage.getItem("ryvt-saved")||"[]"); }catch(e){ return []; }
    }
    function paint(){
      var n=readSaved().length;
      badges.forEach(function(el){ el.textContent=n; el.classList.toggle("on", n>0); });
    }
    window.__ryvtSaved = { read: readSaved, paint: paint,
      toggle: function(id){
        var a=readSaved(), i=a.indexOf(id);
        if(i>-1) a.splice(i,1); else a.push(id);
        try{ localStorage.setItem("ryvt-saved", JSON.stringify(a)); }catch(e){}
        paint(); return i===-1;
      }};
    paint();
    window.addEventListener("storage", paint);
  }
}
})();
