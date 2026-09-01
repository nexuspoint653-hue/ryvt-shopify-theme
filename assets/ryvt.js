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
function boot(root){ initRows(root); initTap(root); initNavFx(root); initCards(root); initNums(root); initCount(root); initPin(root); initAcc(root); initProduct(root); initFav(root); initBands(root); observe(root); }
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

function initTap(root){
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  (root||document).querySelectorAll("[data-tap]").forEach(function(el){
    if(el.dataset.tapReady) return; el.dataset.tapReady="1";
    var timer=null;
    function down(){ el.classList.remove("punch"); el.classList.add("is-tap"); }
    function up(){
      if(!el.classList.contains("is-tap")) return;
      el.classList.remove("is-tap");
      if(reduce) return;
      void el.offsetWidth;
      el.classList.add("punch");
      clearTimeout(timer);
      timer=setTimeout(function(){ el.classList.remove("punch"); },420);
    }
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", function(){ el.classList.remove("is-tap"); });
    el.addEventListener("pointerleave", function(){ el.classList.remove("is-tap"); });
    el.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" ") down(); });
    el.addEventListener("keyup", up);
    el.addEventListener("blur", function(){ el.classList.remove("is-tap"); });
  });
}

/* one motion language: letter roll + press punch on every text CTA */
var FX_SEL = ".nav-i, .ulink, .mall, .ilink, .btn, .ibtn, .chip, .ssubmit, .faqx-tabs button, .pc-more, .dall, .sub, .ck-ok, [data-fx]";
function initNavFx(root){
  (root||document).querySelectorAll(FX_SEL).forEach(function(el){
    if(el.dataset.fx || el.classList.contains("dim")) return;
    if(el.querySelector(".soon") || el.querySelector(".nfx")) return;
    var txt=(el.textContent||"").trim();
    if(!txt || txt.length>34) return;
    el.dataset.fx="1";
    el.classList.add("fx-host");
    if(!el.hasAttribute("data-tap")) el.setAttribute("data-tap","");
    function row(cls,hide){
      var r=document.createElement("span");
      r.className=cls;
      if(hide) r.setAttribute("aria-hidden","true");
      txt.split("").forEach(function(ch,i){
        var c=document.createElement("i");
        c.style.setProperty("--i", i);
        if(ch===" "){ c.className="sp"; c.innerHTML="&nbsp;"; }
        else c.textContent=ch;
        r.appendChild(c);
      });
      return r;
    }
    var wrap=document.createElement("span");
    wrap.className="nfx";
    wrap.appendChild(row("nfx-a",false));
    wrap.appendChild(row("nfx-b",true));
    el.textContent="";
    if(!el.getAttribute("aria-label")) el.setAttribute("aria-label", txt);
    el.appendChild(wrap);
  });
  initTap(root);
}

/* product card: colour circles swap the image, sizes add straight to bag */
function initCards(root){
  (root||document).querySelectorAll(".pc").forEach(function(card){
    if(card.dataset.cardReady) return; card.dataset.cardReady="1";
    var main=card.querySelector("[data-pc-main]"), alt=card.querySelector("[data-pc-alt]");

    card.querySelectorAll("[data-sw]").forEach(function(dot){
      function pick(){
        card.querySelectorAll("[data-sw]").forEach(function(d){
          d.classList.toggle("on", d===dot);
          d.setAttribute("aria-pressed", d===dot ? "true":"false");
        });
        var src=dot.getAttribute("data-img");
        if(src && main){
          if(!main.dataset.orig) main.dataset.orig=main.getAttribute("src");
          main.setAttribute("src", src);
          main.removeAttribute("srcset");
          if(alt) alt.style.display="none";
        }
        var vid=dot.getAttribute("data-vid");
        if(vid) card.querySelectorAll(".pc-add1").forEach(function(b){ b.setAttribute("data-vid", vid); });
      }
      dot.addEventListener("click", function(e){ e.preventDefault(); pick(); });
      dot.addEventListener("pointerenter", function(){ if(CAN_HOVER) pick(); });
    });

    function flash(btn, label){
      var msg=card.querySelector("[data-quick-msg]");
      btn.classList.add("added");
      if(msg){ msg.textContent=label; msg.classList.add("on"); }
      setTimeout(function(){
        btn.classList.remove("added");
        if(msg){ msg.classList.remove("on"); setTimeout(function(){ msg.textContent=""; },260); }
      }, 1600);
    }
    function addToBag(btn){
      var id=btn.getAttribute("data-vid");
      if(!id || btn.disabled) return;
      btn.disabled=true;
      fetch("/cart/add.js", {
        method:"POST",
        headers:{"Content-Type":"application/json","Accept":"application/json"},
        body:JSON.stringify({items:[{id:Number(id), quantity:1}]})
      }).then(function(r){ return r.ok ? r.json() : Promise.reject(r); })
        .then(function(){
          flash(btn, "Added to bag");
          return fetch("/cart.js").then(function(r){ return r.json(); });
        })
        .then(function(cart){
          document.querySelectorAll("[data-cart-count]").forEach(function(el){
            el.textContent=cart.item_count;
            el.classList.toggle("on", cart.item_count>0);
          });
          document.dispatchEvent(new CustomEvent("ryvt:cart", {detail:cart}));
        })
        .catch(function(){ flash(btn, "Try again"); })
        .then(function(){ btn.disabled=false; });
    }
    card.querySelectorAll(".pc-size:not(.out), .pc-add1").forEach(function(btn){
      btn.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); addToBag(btn); });
    });
  });
}

/* count numbers up from zero when they scroll into view */
/* wrap every number in copy so it can count up */
function initNums(root){
  root = root || document;
  var host = (root.nodeType === 9) ? root.body : root;
  if(!host || !host.querySelectorAll) return;
  var SKIP = "script,style,noscript,template,input,textarea,select,option,svg,code,pre," +
             "[data-variants],[data-nocount],[data-count],.cnum,.rte,.acc-b,.doc-b," +
             ".qty,.opt-row,.cnt,.ck,.f-legal,.sz,.sw-btn,.doc-meta,.fbot,time," +
             ".nfx,.fx-host,[data-fx]";
  var walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
    acceptNode: function(n){
      if(!/[0-9]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      var p = n.parentElement;
      if(!p || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var nodes = [], n;
  while((n = walker.nextNode())) nodes.push(n);
  nodes.forEach(function(t){
    var s = t.nodeValue, re = /[0-9][0-9.,]*/g, frag = document.createDocumentFragment(),
        last = 0, m, hit = false;
    while((m = re.exec(s))){
      var num = m[0].replace(/[.,]+$/, "");
      re.lastIndex = m.index + num.length;
      if(num.length > 12) continue;
      if(/^(18|19|20)[0-9][0-9]$/.test(num)) continue;   /* leave years alone */
      hit = true;
      if(m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
      var sp = document.createElement("span");
      sp.className = "cnum";
      sp.setAttribute("data-count", "");
      sp.textContent = num;
      frag.appendChild(sp);
      last = m.index + num.length;
    }
    if(!hit) return;
    if(last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    t.parentNode.replaceChild(frag, t);
  });
}

function initCount(root){
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  (root||document).querySelectorAll("[data-count]").forEach(function(el, idx){
    if(el.dataset.countReady) return; el.dataset.countReady="1";
    var raw = (el.textContent||"").trim();
    var m = raw.match(/^([^0-9]*)([0-9][0-9.,]*)([^0-9]*)$/);
    if(!m) return;
    var pre = m[1], numStr = m[2], suf = m[3];
    var hasComma = numStr.indexOf(",") > -1;
    var decimals = (numStr.split(".")[1] || "").length;
    var target = parseFloat(numStr.replace(/,/g, ""));
    if(isNaN(target)) return;
    var pad = (!decimals && numStr.length > 1 && numStr.charAt(0) === "0") ? numStr.length : 0;
    function fmt(v){
      var out = decimals ? v.toFixed(decimals) : String(Math.round(v));
      while(pad && out.length < pad) out = "0" + out;
      if(hasComma) out = out.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return pre + out + suf;
    }
    el.setAttribute("aria-label", raw);

    el.textContent = fmt(target);
    var box = el.getBoundingClientRect();
    if(!box.width && !box.height) return;          /* hidden: leave it final, never stuck at 0 */
    if(el.classList.contains("cnum") && !el.style.minWidth && box.width){
      el.style.minWidth = (Math.ceil(box.width * 100) / 100) + "px";
    }

    /* once per page-life: a stat that has already counted stays counted */
    window.__cntDone = window.__cntDone || {};
    var key = el.dataset.countKey || (raw + "|" + idx + "|" +
              ((el.closest("[id]") && el.closest("[id]").id) || "s"));
    if(window.__cntDone[key]) return;

    if(reduce) return;
    el.textContent = fmt(0);
    var delay = (parseInt(el.dataset.countDelay, 10) || 0);
    if(!delay){
      var sibs = el.closest("[data-count-group]") || el.parentElement && el.parentElement.parentElement;
      if(sibs){
        var all = [].slice.call(sibs.querySelectorAll("[data-count]"));
        delay = Math.max(0, all.indexOf(el)) * 90;
      }
    }
    var dur = parseInt(el.dataset.countDur, 10) || 1100;
    var started = false;
    function run(){
      if(started) return; started = true;
      window.__cntDone[key] = 1;
      setTimeout(function(){
        var t0 = null;
        function step(ts){
          if(t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / dur);
          var e = 1 - Math.pow(1 - p, 4);
          el.textContent = fmt(target * e);
          if(p < 1) requestAnimationFrame(step);
          else el.textContent = fmt(target);
        }
        requestAnimationFrame(step);
      }, delay);
    }
    if("IntersectionObserver" in window){
      var io = new IntersectionObserver(function(ents){
        ents.forEach(function(en){ if(en.isIntersecting){ run(); io.disconnect(); } });
      }, { threshold: 0.35 });
      io.observe(el);
      /* an element parked off to the side of a horizontal rail never meets the
         viewport, so fall back to watching the rail itself */
      var rail = null, up = el.parentElement, depth = 0;
      while(up && depth++ < 6){
        var ox = getComputedStyle(up).overflowX;
        if((ox === "auto" || ox === "scroll" || ox === "hidden") && up.scrollWidth > up.clientWidth + 4){ rail = up; break; }
        up = up.parentElement;
      }
      if(rail){
        var io2 = new IntersectionObserver(function(ents){
          ents.forEach(function(en){ if(en.isIntersecting){ run(); io2.disconnect(); io.disconnect(); } });
        }, { threshold: 0.2 });
        io2.observe(rail);
      }
    } else run();
  });
}

/* hero pin: the next section scrolls up over a held hero */
function initPin(root){
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  (root||document).querySelectorAll("[data-pin]").forEach(function(el){
    if(el.dataset.pinReady) return; el.dataset.pinReady="1";
    var fade = (parseFloat(el.dataset.pinFade||"60")/100);
    el.style.setProperty("--pin-fade", fade);
    if(reduce) return;
    if(!window.__pinList){
      window.__pinList=[];
      var t=false;
      function frame(){
        window.__pinList.forEach(function(h){
          var wrap = h.parentElement || h;
          var next = wrap.nextElementSibling;
          var span = h.offsetHeight || wrap.offsetHeight || 1;
          var covered;
          if(next){
            covered = (span - next.getBoundingClientRect().top) / span;
          } else {
            covered = window.scrollY / span;
          }
          covered = Math.min(1, Math.max(0, covered));
          h.style.setProperty("--pin-p", covered.toFixed(3));
        });
        t=false;
      }
      window.addEventListener("scroll",function(){ if(!t){ t=true; requestAnimationFrame(frame); } },{passive:true});
      window.addEventListener("resize",frame);
      frame();
    }
    window.__pinList.push(el);
  });
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
  initTap(hdr);
  initTap(document.getElementById("drawer"));
  initNavFx(hdr);

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

/* ---------- Laya card: hover film ramps up, fades out on leave ---------- */
function wireCard(cardEl){
  if(cardEl.dataset.wired) return; cardEl.dataset.wired="1";
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  if(matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  var v=cardEl.querySelector("video"); if(!v) return;
  var SLOW=0.22,FULL=1.0,UP=1500,DOWN=700,FADE=750;
  v.muted=true; v.loop=true; v.playsInline=true; v.removeAttribute("controls");
  var raf=null,leaveT=null,loaded=false;
  function ramp(from,to,dur){
    cancelAnimationFrame(raf); var t0=performance.now();
    (function step(now){
      var t=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-t,3);
      try{ v.playbackRate=from+(to-from)*e; }catch(err){}
      if(t<1) raf=requestAnimationFrame(step);
    })(t0);
  }
  cardEl.addEventListener("pointerenter",function(){
    clearTimeout(leaveT);
    if(!loaded){ v.load(); loaded=true; }
    try{ v.currentTime=0; v.playbackRate=SLOW; }catch(e){}
    var p=v.play(); if(p&&p.catch) p.catch(function(){});
    cardEl.classList.add("playing"); ramp(SLOW,FULL,UP);
  });
  cardEl.addEventListener("pointerleave",function(){
    cardEl.classList.remove("playing");
    ramp(v.playbackRate||FULL,0.3,DOWN);
    leaveT=setTimeout(function(){
      cancelAnimationFrame(raf);
      try{ v.pause(); v.currentTime=0; v.playbackRate=SLOW; }catch(e){}
    },FADE);
  });
}
function wireAllCards(root){ (root||document).querySelectorAll(".card").forEach(wireCard); }
document.addEventListener("DOMContentLoaded",function(){ wireAllCards(document); });

/* ==========================================================================
   Ported from the site: the behaviour the ryvt.css markup expects.
   Everything below is additive and namespaced to its own IIFE, so it does not
   disturb the Shopify plumbing above (cart, variants, accordions).
   ========================================================================== */
(function ryvtSite(){
  "use strict";
  var $  = function(s, r){ return (r||document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

  /* ---------------- header: mega menu, search, scrim ---------------- */
  (function chrome(){
    var scrim = $('[data-scrim]');
    function openScrim(){ if(scrim){ scrim.hidden = false; requestAnimationFrame(function(){ scrim.classList.add('on'); }); } }
    function closeAll(){
      $$('[data-panel]').forEach(function(p){ p.classList.remove('on'); });
      var s = $('[data-srch]'); if(s) s.classList.remove('on');
      $$('[data-menu]').forEach(function(m){ m.classList.remove('on'); });
      $$('[data-drop]').forEach(function(b){ b.setAttribute('aria-expanded','false'); });
      if(scrim){ scrim.classList.remove('on'); setTimeout(function(){ scrim.hidden = true; }, 300); }
    }
    function openDrop(btn){
      var panel = $('[data-panel="' + btn.dataset.drop + '"]');
      if(!panel) return;
      closeAll();
      panel.classList.add('on');
      btn.setAttribute('aria-expanded','true');
      openScrim();
      var wrap = btn.closest('[data-menu]');
      if(wrap) wrap.classList.add('on');
    }

    $$('[data-drop]').forEach(function(btn){
      /* Shop is a destination as well as a menu: clicking goes to the
         collection, hovering opens the menu */
      if(btn.hasAttribute('data-shop-nav')){
        btn.addEventListener('click', function(){
          var href = btn.getAttribute('data-href');
          if(href) window.location.href = href;
        });
        return;
      }
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var panel = $('[data-panel="' + btn.dataset.drop + '"]');
        if(panel && panel.classList.contains('on')) closeAll(); else openDrop(btn);
      });
    });

    if(matchMedia('(hover:hover) and (pointer:fine)').matches){
      $$('[data-menu] [data-drop]').forEach(function(btn){
        btn.closest('[data-menu]').addEventListener('mouseenter', function(){ openDrop(btn); });
      });
      var hd = $('.hd');
      if(hd) hd.addEventListener('mouseleave', function(){
        var s = $('[data-srch]');
        if(s && s.classList.contains('on')) return;
        closeAll();
      });
    }

    var openBtn = $('[data-search-open]');
    if(openBtn) openBtn.addEventListener('click', function(){
      var s = $('[data-srch]'), was = s.classList.contains('on');
      closeAll();
      if(!was){ s.classList.add('on'); openScrim(); setTimeout(function(){ var q = $('[data-q]'); if(q) q.focus(); }, 60); }
    });
    var closeBtn = $('[data-search-close]');
    if(closeBtn) closeBtn.addEventListener('click', closeAll);
    var clearBtn = $('[data-search-clear]');
    if(clearBtn) clearBtn.addEventListener('click', function(){
      var q = $('[data-q]'); if(q){ q.value = ''; q.focus(); } clearBtn.hidden = true;
    });
    var q = $('[data-q]');
    if(q) q.addEventListener('input', function(){ if(clearBtn) clearBtn.hidden = !q.value; });

    /* a suggestion chip runs the search rather than just filling the box */
    $$('.srch-terms button').forEach(function(b){
      b.addEventListener('click', function(){
        var term = b.getAttribute('data-term') || b.textContent;
        var form = b.closest('form');
        if(q) q.value = term;
        if(form) form.submit();
      });
    });

    addEventListener('keydown', function(e){ if(e.key === 'Escape') closeAll(); });
    document.addEventListener('click', function(e){
      if(e.target.closest('.hd') || e.target.closest('.srch-scrim')) return;
      closeAll();
    });
    if(scrim) scrim.addEventListener('click', closeAll);
  })();

  /* ---------------- the Detroit clock ---------------- */
  (function clock(){
    var outs = $$('[data-time]');
    if(!outs.length) return;
    var city = (document.body.getAttribute('data-tz') || 'America/Detroit');
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: city
      });
    } catch(e){
      fmt = new Intl.DateTimeFormat('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false });
    }
    function tick(){
      var t = fmt.format(new Date()).replace(/:/g, ' : ');
      outs.forEach(function(o){ o.textContent = t; });
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------------- now playing ---------------- */
  (function nowPlaying(){
    var np = $('[data-np]'), toggle = $('[data-np-toggle]'), icon = $('[data-np-icon]');
    if(!np || !toggle) return;
    toggle.addEventListener('click', function(){
      var on = np.classList.toggle('playing');
      if(icon) icon.innerHTML = on
        ? '<path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/>'
        : '<path d="M8 5l11 7-11 7z"/>';
      toggle.setAttribute('aria-label', on ? 'Pause preview' : 'Play preview');
    });
  })();

  /* ---------------- the drops square ----------------
     A slow cross-fade through the photos in the footer pill. */
  (function drops(){
    var box = $('[data-slides]');
    if(!box) return;
    var shots = $$('img', box);
    if(shots.length < 2 || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var i = 0, timer = null;
    function step(){ shots[i].classList.remove('on'); i = (i + 1) % shots.length; shots[i].classList.add('on'); }
    function run(){ stop(); timer = setInterval(step, 3400); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    document.addEventListener('visibilitychange', function(){ document.hidden ? stop() : run(); });
    run();
  })();

  /* ---------------- the shipping promise ----------------
     Rests at a whisper so there is something to find, then stays lit. */
  (function shipLine(){
    var el = $('[data-ship]');
    if(!el) return;
    function lit(){ el.classList.add('lit'); }
    el.addEventListener('mouseenter', lit);
    el.addEventListener('focus', lit);
    el.addEventListener('touchstart', lit, { passive:true });
  })();

  /* ---------------- the construction specs ----------------
     Hovering a row brings its spec in from the right and holds it ten
     seconds so it can be read, then lets it go. */
  $$('[data-detail]').forEach(function(row){
    var t = null;
    function reveal(){
      clearTimeout(t);
      row.classList.add('show');
      t = setTimeout(function(){ row.classList.remove('show'); }, 10000);
    }
    row.addEventListener('mouseenter', reveal);
    row.addEventListener('focusin', reveal);
  });

  /* ---------------- the shop filter drawer ----------------
     Folded away until wanted, never hidden: the button says what is on. */
  (function filterDrawer(){
    var btn = $('[data-filt-toggle]'), panel = $('[data-filt-panel]');
    if(!btn || !panel) return;
    function set(open){
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(open){
        panel.hidden = false;
        panel.style.height = '0px';
        var h = panel.scrollHeight;
        requestAnimationFrame(function(){
          panel.style.transition = 'height .45s cubic-bezier(.22,.61,.36,1)';
          panel.style.height = h + 'px';
        });
        setTimeout(function(){ panel.style.height = 'auto'; }, 470);
      } else {
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(function(){ panel.style.height = '0px'; });
        setTimeout(function(){ panel.hidden = true; panel.style.height = ''; }, 470);
      }
    }
    btn.addEventListener('click', function(){ set(btn.getAttribute('aria-expanded') !== 'true'); });
    /* arriving on a filtered collection opens it, so the narrowed grid is
       never a mystery */
    if(location.search.indexOf('filter.') > -1 || location.pathname.indexOf('/collections/') === 0 &&
       document.body.getAttribute('data-filtered') === 'true'){ set(true); }
  })();

  /* ---------------- cookie preferences ----------------
     A real dialog: it remembers what was chosen and hands the answer to one
     place, so pointing it at Shopify's consent API is a one-line change. */
  (function cookies(){
    var box = $('[data-ck]');
    if(!box) return;
    var rows = $$('[data-ck-toggle]', box), note = $('[data-ck-note]', box), last = null, KEY = 'ryvt.consent';
    var mem = null;
    function load(){ try { var raw = localStorage.getItem(KEY); if(raw) return JSON.parse(raw); } catch(e){} return mem; }
    function save(v){ mem = v; try { localStorage.setItem(KEY, JSON.stringify(v)); } catch(e){} }

    function paint(){
      var c = load() || { analytics:true, marketing:true };
      rows.forEach(function(r){
        var on = !!c[r.dataset.ckToggle];
        r.classList.toggle('on', on);
        r.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if(note) note.textContent = c.at
        ? 'Saved ' + new Date(c.at).toLocaleDateString(undefined, { day:'numeric', month:'long', year:'numeric' })
        : '';
    }
    function open(){
      last = document.activeElement;
      paint();
      box.hidden = false;
      requestAnimationFrame(function(){ box.classList.add('on'); });
      document.body.style.overflow = 'hidden';
      var f = $('[data-ck-toggle]', box); if(f) f.focus();
    }
    function close(){
      box.classList.remove('on');
      document.body.style.overflow = '';
      setTimeout(function(){ box.hidden = true; }, 380);
      if(last && last.focus) last.focus();
    }
    function apply(c){
      save(c);
      if(window.Shopify && Shopify.customerPrivacy && Shopify.customerPrivacy.setTrackingConsent){
        Shopify.customerPrivacy.setTrackingConsent(
          { analytics:c.analytics, marketing:c.marketing, preferences:c.analytics }, function(){});
      }
    }
    function read(){
      var c = { at: Date.now() };
      rows.forEach(function(r){ c[r.dataset.ckToggle] = r.classList.contains('on'); });
      return c;
    }
    $$('[data-cookie-open]').forEach(function(b){ b.addEventListener('click', function(e){ e.preventDefault(); open(); }); });
    $$('[data-ck-close]', box).forEach(function(b){ b.addEventListener('click', close); });
    rows.forEach(function(r){
      r.addEventListener('click', function(){
        var on = !r.classList.contains('on');
        r.classList.toggle('on', on);
        r.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
    var rej = $('[data-ck-reject]', box);
    if(rej) rej.addEventListener('click', function(){
      rows.forEach(function(r){ r.classList.remove('on'); r.setAttribute('aria-pressed','false'); });
      apply(read()); close();
    });
    var sav = $('[data-ck-save]', box);
    if(sav) sav.addEventListener('click', function(){ apply(read()); close(); });
    addEventListener('keydown', function(e){ if(e.key === 'Escape' && box.classList.contains('on')) close(); });
  })();

  /* ---------------- text arrives rather than appearing ---------------- */
  (function rise(){
    if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var SEL = '.sec-h, .stat, .marq, .cat, .card, .tile, .keep-in > *, .split .txt,' +
              ' .doc-hd .wrap > *, .doc-body section, .doc-nav,' +
              ' .st-open-in > *, .st-spec div, .st-step, .st-quote blockquote, .st-by,' +
              ' .st-detail-txt > *, .st-detail-media,' +
              ' .br-title, .br-lead, .br-based p, .br-source > *, .br-figs div, .br-news-in > *,' +
              ' .pdp > *, .acc details, .pdp-trust, .hud-ft-in > *, .hud-ft-btm > *';
    function arm(root){
      $$(SEL, root || document).forEach(function(el){
        if(el.hasAttribute('data-rise')) return;
        el.setAttribute('data-rise', '1');
        var p = el.parentElement, n = 0;
        if(p){ n = Array.prototype.indexOf.call(p.children, el); }
        el.style.transitionDelay = Math.min(n, 6) * 60 + 'ms';
        io.observe(el);
      });
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -2% 0px', threshold: 0.01 });
    arm(document);
    /* safety net: anything the observer misses at the foot of a document */
    addEventListener('scroll', function(){
      requestAnimationFrame(function(){
        $$('[data-rise]:not(.in)').forEach(function(el){
          var r = el.getBoundingClientRect();
          if(r.top < innerHeight && r.bottom > 0) el.classList.add('in');
        });
      });
    }, { passive:true });
    document.addEventListener('shopify:section:load', function(e){ arm(e.target); });
  })();
})();

/* ==========================================================================
   Product page: variant selection against the real Shopify variant list.
   ========================================================================== */
(function ryvtProduct(){
  "use strict";
  var form = document.getElementById('pdp-form');
  if(!form) return;
  var data = window.__ryvtVariants;
  if(!data) return;
  var idField = form.querySelector('[data-variant-id]');
  var addBtn  = form.querySelector('[data-add]');
  var priceEl = document.querySelector('.pdp .price');
  var nameEl  = document.querySelector('[data-color-name]');

  function chosen(){
    var out = [];
    Array.prototype.forEach.call(document.querySelectorAll('[data-opt]'), function(b){
      if(!b.classList.contains('on')) return;
      out[parseInt(b.getAttribute('data-opt'), 10) - 1] = b.getAttribute('data-val');
    });
    return out;
  }
  function match(){
    var want = chosen();
    for(var i = 0; i < data.length; i++){
      var v = data[i], ok = true;
      for(var k = 0; k < want.length; k++){
        if(want[k] && v.options[k] !== want[k]){ ok = false; break; }
      }
      if(ok) return v;
    }
    return null;
  }
  function sync(){
    var v = match();
    if(!v){
      if(addBtn){ addBtn.disabled = true; addBtn.textContent = 'Unavailable'; }
      return;
    }
    if(idField) idField.value = v.id;
    if(priceEl) priceEl.textContent = v.price_formatted;
    if(nameEl && v.options[0]) nameEl.textContent = v.options[0];
    if(addBtn){
      addBtn.disabled = !v.available;
      addBtn.textContent = v.available ? ('Add to bag — ' + v.price_formatted) : 'Sold out';
    }
    if(history.replaceState){
      var u = new URL(location.href); u.searchParams.set('variant', v.id);
      history.replaceState({}, '', u);
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-opt]'), function(btn){
    btn.addEventListener('click', function(){
      var group = btn.getAttribute('data-opt');
      Array.prototype.forEach.call(document.querySelectorAll('[data-opt="' + group + '"]'), function(b){
        b.classList.remove('on');
      });
      btn.classList.add('on');
      sync();
    });
  });

  /* gallery thumbnails swap the main image */
  var main = document.querySelector('.pdp-main');
  Array.prototype.forEach.call(document.querySelectorAll('.pdp-thumb'), function(t){
    t.addEventListener('click', function(){
      var img = t.querySelector('img');
      if(main && img){ main.src = img.src.replace(/width=\d+/, 'width=1400'); }
      Array.prototype.forEach.call(document.querySelectorAll('.pdp-thumb'), function(x){ x.classList.remove('on'); });
      t.classList.add('on');
    });
  });
})();
