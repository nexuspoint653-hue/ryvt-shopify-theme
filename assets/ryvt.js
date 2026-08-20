/* RYVT theme behaviours */
(function(){
"use strict";
var CAN_HOVER=matchMedia("(hover:hover) and (pointer:fine)").matches;

/* ---- mega menu ---- */
function initHeader(){
  var hdr=document.getElementById("hdr"); if(!hdr) return;
  var mega=hdr.querySelector(".mega"), scrim=document.getElementById("scrim"), t=null;
  function close(){
    if(mega) mega.classList.remove("open");
    hdr.querySelectorAll(".mega-in").forEach(function(m){m.classList.remove("show");});
    hdr.querySelectorAll(".nav-i").forEach(function(a){a.classList.remove("on");});
    if(scrim && !document.body.classList.contains("search-open")) scrim.classList.remove("on");
  }
  hdr.querySelectorAll(".nav-i[data-menu]").forEach(function(a){
    function open(){
      clearTimeout(t); if(!mega) return;
      mega.classList.add("open");
      hdr.querySelectorAll(".mega-in").forEach(function(m){m.classList.toggle("show",m.id===a.dataset.menu);});
      a.classList.add("on"); if(scrim) scrim.classList.add("on");
    }
    a.addEventListener("pointerenter",function(){ if(CAN_HOVER) open(); });
    a.addEventListener("focus",open);
  });
  hdr.addEventListener("pointerleave",function(){ t=setTimeout(close,150); });
  hdr.addEventListener("pointerenter",function(){ clearTimeout(t); });
  if(scrim) scrim.addEventListener("click",close);
  document.addEventListener("keydown",function(e){ if(e.key==="Escape"){ close(); closeSearch(); closeDrawer(); } });
  window.__ryvtCloseMega=close;
}

/* ---- search panel ---- */
function closeSearch(){
  var s=document.getElementById("search"); if(!s) return;
  s.classList.remove("on"); document.body.classList.remove("search-open");
  var sc=document.getElementById("scrim"); if(sc) sc.classList.remove("on");
}
function closeDrawer(){ var d=document.getElementById("drawer"); if(d) d.classList.remove("on"); }
function initPanels(){
  var s=document.getElementById("search"), sc=document.getElementById("scrim");
  var btn=document.getElementById("searchBtn");
  if(btn&&s) btn.addEventListener("click",function(){
    s.classList.add("on"); document.body.classList.add("search-open");
    if(sc) sc.classList.add("on");
    setTimeout(function(){ var i=s.querySelector("input"); if(i) i.focus(); },380);
  });
  var x=document.getElementById("searchX"); if(x) x.addEventListener("click",closeSearch);
  if(sc) sc.addEventListener("click",closeSearch);
  var b=document.getElementById("burger"), d=document.getElementById("drawer");
  if(b&&d) b.addEventListener("click",function(){ d.classList.add("on"); });
  var dx=document.getElementById("drawerX"); if(dx) dx.addEventListener("click",closeDrawer);
  document.querySelectorAll("[data-sub]").forEach(function(btn){
    btn.addEventListener("click",function(){
      var el=document.getElementById(btn.dataset.sub); if(!el) return;
      var open=el.style.maxHeight && el.style.maxHeight!=="0px";
      el.style.maxHeight = open ? "0px" : el.scrollHeight+"px";
      var sp=btn.querySelector("span"); if(sp) sp.textContent = open ? "+" : "–";
    });
  });
}

/* ---- rows never leave empty cells ---- */
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
      b.classList.toggle("on");
      b.setAttribute("aria-pressed", b.classList.contains("on") ? "true" : "false");
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

function boot(root){ initRows(root); initAcc(root); initProduct(root); initFav(root); observe(root); }
document.addEventListener("DOMContentLoaded",function(){ initHeader(); initPanels(); boot(document); });
document.addEventListener("shopify:section:load",function(e){ initHeader(); initPanels(); boot(e.target); });
})();
