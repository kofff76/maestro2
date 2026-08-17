
(() => {
  const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // hero letters
  qsa('[data-letterize]').forEach(el=>{
    const text=el.textContent.trim(); el.textContent='';
    [...text].forEach(ch=>{const s=document.createElement('span');s.className='char';s.textContent=ch===' '?'\u00a0':ch;el.appendChild(s)});
  });
  requestAnimationFrame(()=>setTimeout(()=>qs('.hero')?.classList.add('ready'),120));

  // menu
  const burger=qs('.burger'), drawer=qs('.drawer');
  const closeMenu=()=>{drawer?.classList.remove('open');burger?.classList.remove('active');burger?.setAttribute('aria-expanded','false')};
  burger?.addEventListener('click',()=>{const on=!drawer.classList.contains('open');drawer.classList.toggle('open',on);burger.classList.toggle('active',on);burger.setAttribute('aria-expanded',String(on))});
  qsa('.drawer a').forEach(a=>a.addEventListener('click',closeMenu));
  addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  // language
  const lang=qs('.lang'); qs('.lang>button')?.addEventListener('click',()=>lang.classList.toggle('open'));
  addEventListener('click',e=>{if(lang && !lang.contains(e.target)) lang.classList.remove('open')});
  const translations={
   ru:{home:'Главная',about:'О нас',artists:'Артисты',network:'Агентства',services:'Инструменты',media:'Media',contact:'Контакты',request:'Запросить представительство',heroK:'Private artist representation · International network',heroSub:'Голос достоин мира, который соответствует его масштабу.',heroA:'Артисты',heroB:'Агентства',heroC:'Россия · Китай · Азия',manifest:'Мы создаём вокруг артиста профессиональную среду — визуальную, цифровую и международную.',gate1:'Я артист',gate2:'Я агентство',gate3:'Я ищу артиста',net:'Международная профессиональная сеть',serv:'Инструменты артиста',final:'Вы выходите на сцену. Остальное мы строим вокруг вас.'},
   en:{home:'Home',about:'About',artists:'Artists',network:'Agencies',services:'Tools',media:'Media',contact:'Contact',request:'Request representation',heroK:'Private artist representation · International network',heroSub:'A voice deserves a world equal to its scale.',heroA:'Artists',heroB:'Agencies',heroC:'Russia · China · Asia',manifest:'We build the professional world around an artist — visual, digital and international.',gate1:"I'm an artist",gate2:"I'm an agency",gate3:"I'm looking for artists",net:'International professional network',serv:'Artist infrastructure',final:'You take the stage. We build everything around it.'},
   zh:{home:'首页',about:'关于我们',artists:'艺术家',network:'经纪机构',services:'工具',media:'媒体',contact:'联系',request:'申请合作',heroK:'私人艺术家代理 · 国际网络',heroSub:'伟大的声音，值得同等规模的世界。',heroA:'艺术家',heroB:'经纪机构',heroC:'俄罗斯 · 中国 · 亚洲',manifest:'我们为艺术家构建完整的专业环境：视觉、数字与国际发展。',gate1:'我是艺术家',gate2:'我是经纪机构',gate3:'我在寻找艺术家',net:'国际专业网络',serv:'艺术家专业工具',final:'您登上舞台。其余的一切，由我们为您构建。'},
   ja:{home:'ホーム',about:'私たちについて',artists:'アーティスト',network:'エージェンシー',services:'ツール',media:'メディア',contact:'お問い合わせ',request:'代理を依頼',heroK:'プライベート・アーティスト・リプレゼンテーション · 国際ネットワーク',heroSub:'偉大な声には、その規模にふさわしい世界が必要です。',heroA:'アーティスト',heroB:'エージェンシー',heroC:'ロシア · 中国 · アジア',manifest:'アーティストを取り巻くプロフェッショナルな環境を、ビジュアル・デジタル・国際展開まで構築します。',gate1:'アーティストです',gate2:'エージェンシーです',gate3:'アーティストを探しています',net:'国際プロフェッショナルネットワーク',serv:'アーティストのためのインフラ',final:'あなたは舞台へ。私たちはその周囲のすべてを構築します。'},
   ko:{home:'홈',about:'소개',artists:'아티스트',network:'에이전시',services:'도구',media:'미디어',contact:'연락처',request:'에이전시 신청',heroK:'프라이빗 아티스트 매니지먼트 · 국제 네트워크',heroSub:'위대한 목소리에는 그에 걸맞은 세계가 필요합니다.',heroA:'아티스트',heroB:'에이전시',heroC:'러시아 · 중국 · 아시아',manifest:'아티스트를 위한 시각적·디지털·국제적 전문 환경을 구축합니다.',gate1:'아티스트입니다',gate2:'에이전시입니다',gate3:'아티스트를 찾습니다',net:'국제 전문 네트워크',serv:'아티스트 인프라',final:'당신은 무대에 오릅니다. 나머지는 우리가 만듭니다.'}
  };
  function setLang(code){localStorage.setItem('maestro-lang',code);document.documentElement.lang=code;const d=translations[code]||translations.en;qsa('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(d[k])el.textContent=d[k]});qs('[data-lang-current]')&&(qs('[data-lang-current]').textContent=code.toUpperCase());lang?.classList.remove('open')}
  qsa('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  setLang(localStorage.getItem('maestro-lang')||'ru');

  // intersection reveals
  if(!reduced){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});
    qsa('.reveal,.line-draw').forEach(el=>io.observe(el));
  } else qsa('.reveal,.line-draw').forEach(el=>el.classList.add('in'));

  // stable scroll-driven editorial slider (no external library)
  const section=qs('[data-editorial]');
  if(section){
    const slides=qsa('.editorial-slide',section), bars=qsa('.editorial-progress i',section);
    let ticking=false;
    function update(){
      const r=section.getBoundingClientRect(); const total=Math.max(1,section.offsetHeight-innerHeight); const progress=Math.min(1,Math.max(0,-r.top/total));
      const n=slides.length; const scaled=progress*(n-1); const idx=Math.min(n-1,Math.floor(scaled+0.0001));
      slides.forEach((s,i)=>{
        let local;
        if(i<idx) local=1; else if(i>idx) local=0; else local=scaled-idx;
        if(i===n-1 && idx===n-1)local=1;
        // first slide always visible at start; next slides wipe over it
        const visible=i===0?1:(i<idx?1:(i===idx?Math.max(.001,local):0));
        s.style.opacity=visible?1:0;
        const clip=i===0?'inset(0 0 0 0)':`inset(0 ${100-visible*100}% 0 0)`;
        s.style.clipPath=clip; s.classList.toggle('active', i===Math.round(scaled));
        const img=qs('img',s); if(img) img.style.transform=`scale(1.035) translateY(${(progress-.5)*(i%2?10:-10)}px)`;
      });
      bars.forEach((b,i)=>{const start=i/(n-1),end=(i+1)/(n-1);let p=i===n-1?(progress>=1?1:0):Math.min(1,Math.max(0,(progress-start)/(end-start)));b.style.setProperty('--p',p)});
      ticking=false;
    }
    addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true}); addEventListener('resize',update); update();
  }
})();
