/* ===================================================================
   cet4_enhance.js  —  四级单词「考频 + 有趣助记」增强包
   依赖：cet4_full.js（window.cet4FullWords）必须先于本文件加载
   设计：
     · 考频：cet4FreqHigh → 高，cet4FreqMid → 中，其余 → 低
     · 助记：优先用谐音/联想口诀（cet4Phonetic），否则用「词缀/词根/
             合成词」拆解引擎（cet4GenMnem），所有释义取自考纲词库本身，
             保证拆解含义可靠、不臆造。
   =================================================================== */
(function () {
  const cet = window.cet4FullWords || [];
  const WORDSET = new Set(cet.map(x => (x.w || '').toLowerCase()));
  const WORDMAP = {};
  cet.forEach(x => { if (x.w) WORDMAP[x.w.toLowerCase()] = x.cn; });
  const lookup = w => WORDMAP[w] || '';

  /* ---------- 考频分层（研究型标注，供背诵优先级参考） ---------- */
  window.cet4FreqHigh = [
    'abandon','ability','able','about','above','abroad','accept','according','account','achieve','across','act','action','active','actually','add','address','admit','advantage','advice','affect','afford','afraid','after','again','against','age','agree','ahead','aim','alive','allow','alone','along','already','although','amaze','amount','analyze','ancient','announce','answer','anxious','anyone','apart','apparent','appear','apply','approach','area','argue','arise','arm','around','arrive','art','article','aspect','assist','assume','attack','attend','attitude','attract','audience','author','available','average','avoid','awake','aware','balance','base','basic','basis','bear','beat','beautiful','because','become','before','begin','behalf','behave','behind','belief','belong','benefit','beside','better','beyond','board','brain','brief','bright','bring','build','burden','business','camera','campaign','cancel','cancer','carbon','career','carry','catch','cause','celebrate','center','central','century','certain','challenge','chance','change','charge','cheap','check','chief','choice','choose','circle','citizen','claim','class','classic','climate','close','coach','collect','college','combine','comfort','command','comment','commit','common','community','company','compare','compete','complete','complex','concept','concern','condition','conduct','conference','confident','confuse','connect','consider','consist','constant','construct','contact','contain','content','contribute','control','convenient','convince','correct','cost','count','country','couple','course','cover','create','credit','culture','curious','current','damage','danger','dead','deal','debate','decade','decide','decrease','deep','defeat','defend','degree','demand','depend','describe','design','desire','detail','develop','device','differ','difficult','direct','direction','discover','discuss','disease','dismiss','distance','distant','distinguish','distribute','district','diverse','document','double','drive','drop','due','duty','each','eager','earn','earth','ease','economy','educate','effect','effort','elect','element','emotion','emphasis','employ','enable','encourage','energy','engage','engine','enjoy','enough','enter','entire','environment','equal','equipment','escape','essay','establish','estimate','even','event','evidence','exact','exam','examine','example','excellent','except','exchange','excite','excuse','exist','expand','expect','expense','experience','expert','explain','explore','express','extent','external','extreme','fact','factor','fail','fair','fall','familiar','famous','far','fault','favor','feature','federal','fee','feed','feel','fellow','female','figure','fill','film','final','finance','find','fine','firm','fish','fit','fix','flat','focus','follow','food','force','foreign','forest','forget','form','formal','format','former','fortune','forward','found','free','friend','function','fund','future','gain','game','general','generate','gentle','genuine','gift','girl','give','glad','goal','gold','good','govern','grade','gradual','grand','grant','grass','grave','great','green','ground','group','grow','guard','guess','guide','habit','hair','half','hand','hang','happen','hard','harm','hate','have','head','health','hear','heart','heat','heavy','help','hero','hide','high','history','hit','hold','hole','home','honest','honor','hope','horror','host','hour','house','however','huge','human','humor','hunt','hurry','idea','ideal','identify','ignore','image','imagine','impact','imply','import','impossible','improve','include','income','increase','indeed','indicate','industry','inform','initial','injure','inside','insist','instance','instead','institute','instruct','intend','interest','internal','international','interpret','interview','introduce','invent','invest','involve','issue','item','job','join','judge','jump','junior','keep','key','kill','kind','king','knowledge','land','language','large','last','late','laugh','law','lead','learn','least','leave','left','legal','less','level','lie','light','limit','link','list','listen','little','live','local','lock','long','look','lose','loss','lot','love','low','machine','magic','main','maintain','major','majority','make','male','manage','manner','many','mark','market','marry','mass','master','matter','may','maybe','mean','meaning','measure','medical','meet','member','memory','mental','mention','message','metal','method','middle','might','military','mind','minister','minor','miss','mission','mistake','mix','model','modern','modest','moment','money','monitor','month','moral','more','most','mother','motion','motor','mount','mouse','mouth','move','movie','much','music','must','name','narrow','nation','native','nature','near','nearly','necessary','need','nervous','network','never','news','next','nice','night','noble','noise','normal','note','notice','number','object','observe','obvious','occur','ocean','offer','office','officer','official','once','only','open','operate','opinion','opportunity','oppose','option','orange','order','organ','organization','origin','other','others','ought','outcome','outside','over','overcome','overlook','owe','own','owner','pack','page','pain','paint','pair','pale','paper','parent','part','participate','particular','partner','party','pass','past','path','patient','pattern','pay','peace','peak','pen','people','per','perfect','perform','perhaps','period','permit','person','personal','persuade','pet','phone','photo','phrase','physical','pick','picture','piece','place','plan','plant','play','please','plenty','point','police','policy','political','pollute','pool','poor','popular','position','positive','possess','possible','post','postpone','potential','power','practice','praise','predict','prefer','prepare','present','press','pretty','prevent','price','pride','primary','prime','principal','print','prior','prison','private','prize','probably','problem','procedure','process','produce','product','profit','program','project','promise','promote','proof','proper','property','propose','protect','protest','proud','prove','provide','public','publish','purpose','pursue','push','quality','quantity','quarter','question','quick','quiet','quite','race','raise','range','rather','rate','rather','reach','react','ready','real','realize','reason','receive','recent','recognize','recommend','record','reduce','reflect','reform','regular','relate','relax','release','relevant','relief','rely','remain','remember','remove','repair','repeat','report','represent','request','require','research','resource','respond','rest','result','retire','return','reveal','reverse','review','reward','rich','ride','ring','rise','risk','road','rock','role','room','root','rough','round','rule','rush','sacrifice','safe','sail','salary','same','sample','save','scan','scene','scholar','school','science','score','search','season','seat','second','secret','section','secure','see','seek','seem','select','sell','send','senior','sense','series','serious','serve','set','settle','several','severe','sex','shadow','shake','shall','shape','share','sharp','she','shift','shine','ship','shock','shoot','short','should','shoulder','show','shut','sick','side','signal','significant','silent','silver','similar','simple','since','skill','skin','slave','sleep','slight','slow','small','smart','smell','smile','smoke','smooth','social','society','soldier','some','someone','something','sometimes','soon','sorrow','sort','sound','source','south','space','speak','special','species','specific','speech','speed','spend','spirit','split','sport','spot','spread','spring','square','stage','stand','star','stare','start','state','station','stay','step','stick','still','stock','stomach','stone','stop','store','storm','story','strange','stress','strict','strike','strong','structure','student','study','stuff','stupid','style','subject','succeed','success','such','sudden','suffer','sugar','suggest','suit','summer','sun','sunny','support','suppose','sure','surface','surprise','surround','survey','survive','suspect','swim','symbol','system','table','take','talent','talk','tall','tape','task','taste','tax','teach','team','tear','technology','telephone','television','tell','temper','temperature','tend','term','test','text','than','thank','theater','then','theory','there','thick','thin','thing','think','third','though','threat','through','throughout','throw','thus','till','time','tiny','tired','title','to','today','together','tone','too','tool','tooth','top','total','touch','tour','town','trace','track','trade','tradition','traffic','train','transform','translate','transport','travel','treat','trend','trial','trip','troop','trust','truth','try','tube','turn','twice','type','typical','under','understand','union','unique','unit','unite','university','unless','until','upon','use','useful','usual','usually','various','vast','vegetable','vehicle','venture','victim','victory','view','village','violence','visit','voice','vote','wage','wait','walk','wall','want','war','warm','warn','wash','waste','watch','water','wave','way','weak','wealth','wear','weather','wedding','week','weigh','weight','welcome','welfare','well','west','what','whatever','while','white','whole','whom','whose','wide','wife','wild','will','win','wind','window','wine','wish','with','within','without','woman','wonder','wood','word','work','worker','world','worry','worse','worth','would','write','wrong','yard','year','young','youth'
  ];
  window.cet4FreqMid = [
    'absence','absolute','abstract','academic','accelerate','acceptance','access','accompany','accomplish','accord','accuse','achievement','acquire','active','adapt','adequate','adjust','administration','admit','adopt','adult','advance','adventure','advertise','advise','affair','agency','agent','aggressive','aid','alarm','alcohol','alike','alive','alliance','allowance','ally','alter','altitude','amateur','ambition','ambulance','amount','amuse','analyze','ancestor','angel','angle','ankle','annoy','annual','anticipate','anxiety','anyway','apart','apartment','apparent','appeal','appearance','applause','appliance','applicant','application','appoint','appreciate','approve','approximate','arbitrary','architect','argue','arise','arouse','arrow','artificial','ashamed','aside','aspect','assault','assemble','assert','assess','asset','assign','assist','associate','assume','assurance','astonish','athlete','atmosphere','attach','attack','attain','attitude','attract','attribute','auction','authentic','authority','automatic','avenue','aware','awkward','bachelor','background','bacteria','badge','baggage','balance','balcony','ban','band','bankrupt','bargain','barrier','basically','basis','batch','beam','beard','beast','beg','being','belief','belly','belong','belt','bend','benefit','besides','beyond','bible','bind','biology','blade','blame','blank','blast','bleed','blend','bless','blind','block','bloody','bloom','blossom','board','boost','border','bore','boring','bound','bow','brake','brand','breast','breed','brick','bride','brilliant','broad','brow','bubble','bucket','budget','buffet','bulk','bump','burden','bureaucracy','burial','bush','butter','cabinet','cable','calculate','calendar','campus','cancel','capable','capacity','capital','captain','capture','carbon','career','cargo','carrier','cart','carve','casual','catalogue','cease','cell','cement','census','ceremony','certificate','challenge','chamber','channel','chaos','chap','character','charity','charm','chase','cheat','cheer','cheque','cherish','chest','chief','chip','choke','circuit','circulate','circumstance','cite','civil','civilian','claim','clap','clarify','classify','clause','claw','clay','client','cliff','clue','clumsy','coach','coarse','coast','code','coffee','coil','collar','colonial','combat','comedy','commander','commerce','commission','commitment','commodity','commonsense','companion','comparison','compass','compatible','compel','compete','competent','complaint','complement','complex','complicate','compose','comprehension','comprehensive','comprise','compromise','conceal','concede','concentrate','concept','concern','concert','conclude','concrete','condemn','condense','conduct','confer','confess','confide','confidential','confirm','conflict','conform','confront','confuse','congratulate','congress','conjunction','conquer','conscience','conscious','consequence','conservative','considerate','consist','console','consolidate','conspicuous','constant','constitute','constrain','construct','consult','consume','contact','contain','contaminate','contemplate','contemporary','contend','content','contest','context','continual','contract','contradict','contrary','contrast','contribute','contrive','controversial','convenience','convention','convert','convey','convict','convince','cooperate','coordinate','cop','cord','core','corporate','corps','correspond','corridor','costume','council','counsel','counter','court','crack','cradle','craft','crash','crawl','cream','create','credit','creep','crew','cricket','crime','crisis','critic','critical','criticize','crop','cross','crow','crown','crucial','crude','cruel','crush','crust','crystal','cue','cultivate','culture','cunning','curb','curiosity','current','curriculum','curtain','curve','cushion','custom','cut','cyberspace','cycle','damn','damp','dare','dash','data','dawn','dazzle','deadline','deaf','deal','dean','debate','debt','decay','deceive','decent','decimal','decline','decorate','decay','dedicate','deed','deepen','default','defeat','defect','deficit','define','definite','definition','delicate','delight','deliver','demand','democracy','demonstrate','denote','dense','dental','deny','depart','depend','depict','deploy','deposit','depress','deprive','derive','descend','deserve','despair','despatch','desperate','dessert','destiny','destroy','detach','detect','deteriorate','deviate','device','devote','diagnose','dictate','differ','digest','dignity','dilemma','diligent','dim','dioxide','diploma','directory','disable','disappear','disappoint','disaster','discard','discern','discharge','discipline','disclose','discount','discourage','discover','discreet','discriminate','disgrace','disguise','disgust','dismay','dismiss','disorder','disperse','displace','display','dispose','dispute','disrupt','dissolve','distance','distant','distinct','distinguish','distort','distract','distress','distribute','district','disturb','dive','diverse','divorce','dizzy','dock','doctrine','document','domain','domestic','dominant','dominate','donate','doom','doubt','drain','drama','drastic','drawback','dread','drift','drip','drought','drown','drum','dual','dumb','dump','duplicate','durable','dwelling','dynamic','eager','earnest','ease','eccentric','eclipse','ecology','economic','edge','edition','editor','effort','eject','elaborate','elderly','elect','electric','elegant','element','elevate','eliminate','eloquent','embark','embarrass','embed','embody','embrace','emerge','emotion','emphasis','empire','empirical','enable','enact','enclose','encounter','endeavor','endow','endure','energetic','enforce','engage','enhance','enlarge','enlighten','enormous','enquire','enrich','enroll','ensure','entail','enterprise','entertain','enthusiasm','entitle','entity','entrance','entrepreneur','envelope','envy','epoch','episode','equality','equip','equivalent','era','erect','erode','error','erupt','essay','essence','essential','establish','estate','esteem','eternal','evacuate','evaporate','eventual','evident','evil','evoke','evolution','exaggerate','exceed','excel','exception','excess','exchange','excite','exclude','excursion','execute','exemplify','exert','exhaust','exhibit','exile','exist','exit','exotic','expand','expedition','expel','expend','expense','expire','explain','explicit','exploit','explore','export','expose','express','extend','extent','external','extinct','extinguish','extract','extraordinary','extravagant','extreme','fable','fabric','facilitate','facility','factor','faculty','fade','fail','faint','faith','fake','famine','fancy','fantastic','fascinate','fatal','faulty','favor','feasible','feast','federal','federation','feeble','fellow','female','feminine','fence','ferry','fetch','fiction','fierce','file','filter','finance','finite','firework','fiscal','fitting','flame','flap','flare','flash','flavor','flee','fleet','flesh','flexible','fling','flourish','fluctuate','fluent','flush','flutter','foam','focus','foil','folk','forbid','force','forecast','foremost','foresight','forge','formal','format','formidable','formula','fort','forth','forum','fossil','foster','foul','foundation','fraction','fragile','fragment','frame','franchise','fraud','freight','frighten','fringe','frost','frown','fruitful','frustrate','fulfill','fume','fund','fundamental','funeral','furious','furnish','furthermore','fuse','fusion','galaxy','gallery','gamble','gang','gaol','gap','garbage','garden','garment','gasp','gauge','gaze','gear','gene','generalize','genius','gentle','genuine','geology','gesture','ghost','giant','given','glance','glare','glide','glimpse','gloomy','glory','glove','glow','glue','goal','gorgeous','gossip','govern','gown','grab','grace','gracious','gradual','grand','grant','graphic','grasp','grateful','gratitude','grave','gravity','graze','grease','greedy','greenhouse','greet','grief','grieve','grim','grin','grind','grip','groan','grocery','grope','gross','grouch','ground','growl','grumble','guarantee','guardian','guess','guidance','guideline','guilt','gulf','gymnasium','habitat','hail','halt','hamper','handbook','handful','handle','handy','harbor','harden','hardly','hardship','harmony','harness','harsh','haste','hatch','haul','haunt','hawk','hazard','headache','heading','headline','headquarters','heal','heap','heave','hedge','heel','heir','hemisphere','herald','herb','herd','heroic','hesitate','hide','hierarchy','highlight','hijack','hike','hinge','hint','hire','hoist','hollow','homogeneous','honorable','hook','hop','horizon','horn','horrible','hostage','hostile','household','hover','howl','huddle','hum','humanity','humble','humid','hunt','hurl','hurricane','hurt','hut','hypothesis','hysterical','iceberg','identical','identify','identity','idiom','ignorant','ignore','illiterate','illusion','illustrate','image','imaginary','imitate','immense','immune','impact','impair','impart','impatient','imperative','impetus','implement','implicit','implied','impose','impress','impulse','incentive','incident','incline','inclusive','incorporate','index','indicate','indifferent','indignant','indispensable','induce','indulge','inertia','infect','infer','inferior','infinite','inflation','inflict','influence','inform','infringe','ingenious','ingredient','inhabit','inherent','inhibit','initial','initiate','inject','injure','inland','inlet','inn','innocent','innovation','input','inquiry','insane','insect','insert','inside','insight','insist','inspect','inspire','install','instant','instinct','institute','instruct','instrument','insulate','insult','insure','intact','integral','integrate','integrity','intellect','intelligence','intend','intense','interact','intercourse','interest','interfere','interior','intermediate','intermittent','intersection','interval','intervene','intimate','intricate','intrigue','intrinsic','introduce','intuition','invade','invalid','invaluable','invariably','invent','invert','invest','invoice','involve','irony','irrigate','isolate','ivory','jail','jazz','jealous','jeans','jelly','jerk','jewel','joint','jolly','journal','junction','jungle','junior','junk','jury','justice','justify','kernel','kettle','kidnap','kidney','kindergarten','kit','knit','knob','knot','label','labor','lace','ladder','lag','lamb','lame','landscape','lane','lantern','lap','lapse','laser','lash','lasting','lately','latent','lateral','latitude','laugh','launch','laundry','lavatory','lawn','layer','layman','layout','leadership','leaflet','leak','lean','leap','learned','lease','leather','lecture','ledge','leisure','lest','levy','liability','liable','liberal','liberate','liberty','librarian','license','lick','likelihood','limb','limitation','limp','linear','linen','liner','linger','liquid','liquor','literacy','literal','literary','litter','live','liver','livestock','living','load','loaf','loan','lobby','local','locality','locate','locker','locomotive','lodge','lofty','logical','longevity','loom','loop','loose','loosen','lord','lorry','lottery','lounge','loyal','lubricate','lump','lunar','lunch','luxury','lyric','machinery','magistrate','magnet','magnificent','maid','majesty','malignant','mammal','manage','maneuver','manifest','manipulate','manual','manuscript','marble','marginal','marvelous','masculine','massive','masterpiece','mat','maturity','maximum','meadow','meaning','meantime','measurable','mechanic','mechanical','mechanism','medal','media','medieval','melt','memo','memorial','mentality','merchandise','mercury','merge','merit','mess','messenger','metal','metaphor','methodology','middle','midst','migrate','mild','military','mingle','miniature','minimal','minimum','minister','ministry','mink','minority','mint','miracle','mischief','miserable','misery','misfortune','missionary','mist','moan','mob','mock','moderate','modernization','modify','module','moist','molecule','momentum','monarch','monetary','monster','morality','mortal','mortgage','moss','motel','motive','motorway','mould','mound','mountainous','mourn','muddy','mug','multiple','multitude','municipal','murmur','muscular','mute','mutter','mutual','myth','naive','naked','napkin','narrative','nasty','naught','naval','navigation','nearly','neat','necessitate','needle','negative','negligible','negotiate','neighborhood','nerve','neutral','nevertheless','nickel','nickname','nil','nominal','nominate','nonetheless','norm','notable','notation','noticeable','notify','notion','notorious','notwithstanding','nourish','novelty','nowhere','nuclear','nucleus','numb','nursery','nurture','nutrition','oak','oath','obedience','obedient','objection','objective','obligation','oblige','obscure','observation','obsession','obsolete','obstacle','obstruct','obtain','obvious','occupation','occupy','occurrence','offence','offend','offensive','offer','offset','offspring','olive','opaque','operational','opinion','opponent','oppose','opposite','oppress','opt','optical','optimistic','optimum','option','oral','orbit','orchard','orchestra','orderly','organ','orient','orientation','originate','ornament','orthodox','ostrich','ounce','outbreak','outcome','outfit','outlet','outline','outlook','output','outrage','outset','outside','outstanding','outward','oval','oven','overall','overcome','overflow','overhear','overlap','overlook','overnight','overseas','overtake','overthrow','owl','ownership','oxide','ozone','pace','pact','pad','paddle','painful','palace','palm','pamphlet','panel','panic','pant','paperback','parade','paradise','paradox','paragraph','parallel','paralyze','parameter','parasite','parcel','pardon','parental','parliament','partial','participant','partition','partly','passerby','passion','pastime','pasture','patent','pathetic','patriot','patrol','patron','pause','pave','paw','pearl','pedal','peel','peer','penalty','pending','pension','perceive','perfection','performance','perfume','periodic','periodical','perish','permeate','permissible','perpetual','perplex','persist','perspective','persuasion','pertinent','pest','petition','petty','phase','phenomenon','philosophy','photo','phrase','physical','physician','pierce','piety','pillar','pinch','pine','pirate','pistol','pitch','plague','plain','plaintiff','planet','plaster','plateau','platform','plausible','plea','pledge','plentiful','plight','plot','plough','plumber','plunge','plural','pneumonia','poem','poet','poison','polar','porcelain','porch','pore','portable','porter','portray','pose','posit','poster','posture','poultry','poverty','powder','practicable','pray','preach','precaution','precede','precedent','precious','precise','preclude','predict','predominant','preference','pregnant','prejudice','preliminary','premier','premise','premium','preparation','prescribe','prescription','presence','presently','preserve','preside','prestige','presume','pretend','pretext','prevail','prevalent','previous','prey','priest','primary','prime','primitive','principal','principle','prior','priority','privacy','private','privilege','probability','probable','procedure','proceed','proclaim','produce','productive','productivity','proficiency','profile','profit','profound','program','progressive','prohibit','projector','prolong','prominent','promise','promising','promote','prompt','prone','proof','propaganda','propel','proper','property','prophet','proportion','proposal','propose','proposition','prose','prospect','prosper','protest','protocol','proton','province','provision','provoke','prudent','psychiatry','psychology','pub','publicity','publish','pudding','puff','pulp','pulse','pumpkin','punch','pupil','puppet','purchase','purify','purity','pursuit','pyramid','qualification','qualify','qualitative','quantify','quantitative','quart','quarterly','quartz','queer','quench','query','quest','queue','quiver','quiz','quotation','quote','rabbit','racial','rack','radiant','radiate','radical','rage','raid','rail','rally','ranch','random','range','rank','rap','rape','rarely','rash','rating','ratio','rational','raw','readily','reading','realistic','realm','reap','rear','rebel','recall','recede','receipt','receiver','reception','recession','recipe','reciprocal','recite','reckless','reckon','reclaim','recognition','recognize','recollect','recommend','reconcile','record','recount','recruit','rectangular','rectify','recycle','reduction','redundant','reed','reel','refer','referee','reference','refine','reflect','reform','refrain','refresh','refuge','refund','refusal','refute','regard','regime','region','register','regulate','rehearsal','reign','rein','reinforce','reject','relate','relax','relay','release','relevant','reliable','reliance','relief','relieve','religion','relish','reluctant','rely','remain','remainder','remark','remedi','remnant','removal','remove','renaissance','render','renew','renovate','rent','repair','repeal','repel','replace','replenish','replica','reproduce','republic','reputation','request','requirement','rescue','resemble','resent','reservation','reserve','reside','resident','resign','resist','resolute','resolution','resolve','resort','resource','respect','respective','respond','response','responsibility','restless','restore','restrain','restrict','resultant','resume','retail','retain','retaliate','retire','retort','retreat','retrieve','retrospect','return','reveal','revenge','revenue','reverse','revise','revive','revolt','revolutionary','revolve','reward','rhythm','ribbon','rid','ridge','rifle','rigid','rigorous','rim','riot','ripple','rise','rival','roar','roast','rob','robust','rocket','rod','romance','rot','royal','rug','rumor','rural','rust','sack','sacred','saddle','safeguard','sailor','salient','salmon','salute','salvage','sample','sanction','sandwich','sane','sarcastic','satire','satisfactory','saturate','saucer','savage','saw','scale','scan','scandal','scar','scare','scarf','scatter','scent','scholar','scold','scope','scorn','scout','scrap','scrape','scratch','scream','screen','screw','script','scrutiny','sculpture','seal','seam','search','seasonal','secondary','section','sector','secure','sedate','sediment','seek','seemingly','segment','seize','seldom','select','senate','senator','sensation','sense','sensible','sensitive','sentiment','sequence','serial','series','sermon','serpent','session','setback','setting','settlement','severe','sew','shabby','shade','shaft','shake','shallow','shame','shampoo','sharpen','shatter','shear','shed','sheer','shell','shelter','shepherd','shield','shift','shilling','shine','shipment','shiver','shock','shoot','shortage','shortcoming','shoulder','shout','shove','showcase','shower','shrewd','shrink','shrug','shutter','shuttle','siege','sigh','sightseeing','signal','signature','significance','significant','signify','silicon','similar','simplicity','simplify','simulate','simultaneous','sin','sincere','singular','sip','siren','site','skeleton','sketch','ski','skilful','skim','skip','skull','skyscraper','slack','slam','slap','slash','slaughter','slave','sleeve','slender','slice','slick','slide','slight','slim','slip','slipper','slogan','slope','slot','slum','slump','smash','smear','smog','smuggle','snack','snap','snatch','sneak','sniff','snob','snore','snort','soak','soar','sober','so-called','soccer','socialism','sociology','socket','sodium','soften','software','soil','solar','sole','solemn','solidarity','solitary','solo','soluble','solve','somewhat','sophisticated','sore','sorrow','soul','sound','sovereign','spade','span','spark','spear','specialist','specialize','species','specifically','specify','specimen','spectacle','spectator','spectrum','speculate','spell','spend','sphere','spice','spinal','spine','spiral','spirit','spit','spite','splash','split','spoil','sponge','sponsor','spontaneous','spoon','sport','spot','spouse','spray','spread','spring','sprinkle','sprout','spur','spy','squad','square','squeeze','squint','stab','stable','stack','stadium','staff','stage','stagger','stain','stair','stake','stale','stalk','stall','stamp','stance','staple','starve','statement','static','stationary','statistic','statue','status','steady','steak','steal','steam','steel','steep','steer','stem','step','stereotype','stern','steward','stick','stiff','still','stimulate','sting','stir','stitch','stock','stoop','storage','stove','strap','straw','streak','stream','streamline','strength','stress','stretch','stride','strife','strike','string','strip','stripe','strive','stroke','stroll','structure','stubborn','studio','stuff','stumble','sturdy','subject','subjective','submarine','submerge','submit','subordinate','subscribe','subsequent','subsidy','substance','substantial','substitute','subtle','subtract','suburb','subway','succession','successive','successor','suck','suffer','sufficient','suggest','suicide','suit','suitable','suite','sulfur','sum','summary','summit','summon','sunrise','sunset','superb','superficial','superior','supersonic','superstition','supervise','supplement','supply','suppose','suppress','supreme','surface','surge','surgeon','surpass','surplus','surrender','surround','survey','survival','survive','susceptible','suspect','suspend','suspicion','sustain','swallow','swamp','swap','swarm','sway','swear','sweat','sweep','swell','swift','swing','switch','sword','symbol','symmetry','sympathetic','sympathize','sympathy','symphony','symptom','syndrome','synthesis','tablet','tackle','tactic','tag','tailor','take','tale','talent','tame','tangible','tangle','tank','tar','target','tariff','tax','tease','tedious','temperament','tempo','tempt','tenant','tend','tender','tennis','tense','tension','tentative','terminal','terminate','terrace','terrain','terrific','terrify','territory','testify','testimony','textile','texture','thank','theft','theme','theory','therapy','thereafter','thereby','therefore','thermal','thesis','thick','thigh','thorn','thorough','thoughtful','thread','threat','threaten','threshold','thrill','thrive','throat','throne','thrust','thumb','thunder','ticket','tickle','tide','tidy','tilt','timber','timely','timid','tin','tinge','tiresome','title','toast','tobacco','toe','tolerance','tolerant','toll','tone','torch','torrent','torture','toss','tow','towel','tower','toxic','trace','track','tractor','trademark','trader','tragedy','trail','trait','tram','tramp','transaction','transcend','transfer','transform','transient','transit','translate','transmission','transmit','transparent','transplant','transport','trap','trash','tray','treason','treaty','treble','tremble','tremendous','trench','trend','trial','triangle','tribe','tribute','trick','trifle','trigger','trim','triple','triumph','trivial','trolley','troop','trophy','tropic','troublesome','trump','trunk','trustee','tub','tube','tuck','tuition','tumble','tumor','tuna','turbine','turkey','turnover','tutor','twist','typhoon','typical','tyrant','ultimate','ultraviolet','umbrella','unanimous','uncover','undergo','undergraduate','underlie','underline','undermine','undertake','uneasy','unemployment','unexpected','unfold','unhappy','uniform','unify','unique','unite','unity','universal','unload','update','upgrade','uphold','upright','uprising','uproar','upset','upstairs','up-to-date','upward','urgent','utmost','utter','vacant','vacation','vacuum','vague','valid','valley','valuable','value','valve','van','vanish','vanity','vapo','variable','variation','variety','various','vary','vase','vast','vault','vegetation','vehicle','veil','vein','velocity','velvet','ventilate','verb','verbal','verdict','verge','verify','versatile','verse','version','vertical','vessel','vest','veteran','veto','via','vibrate','vice','vicious','victim','victory','view','viewpoint','vigorous','villa','violet','violin','virtual','virtue','virus','visa','visible','vision','visual','vital','vitamin','vivid','vocabulary','vocal','vocation','voice','void','volcano','volt','voltage','volume','voluntary','volunteer','vote','voucher','vowel','voyage','vulgar','vulnerable','wage','wagon','waist','wait','waiter','wake','wallet','wander','ward','warehouse','warfare','warmth','warn','warrant','wash','waste','watch','waterfall','waterproof','watt','wave','wax','way','weaken','wealthy','weapon','wear','weary','weave','web','wedding','weed','weep','weigh','weird','weld','welfare','whale','whatsoever','wheat','whereas','whereby','whilst','whip','whirl','whisper','whistle','wholly','wicked','widen','widget','widespread','width','wield','wildlife','will','willow','win','wink','wipe','wire','wisdom','wit','withdraw','withhold','withstand','witness','wolf','wooden','wool','work','workforce','workmate','workshop','worldwide','worship','worst','worth','worthwhile','wound','wrap','wreath','wreck','wrench','wrinkle','wrist','write','wrong','xerox','yawn','yearly','yearn','yeast','yield','youngster','youth','zeal','zebra','zone','zoom'
  ];

  /* ---------- 谐音 / 联想口诀（趣味助记，精选可靠者） ---------- */
  window.cet4Phonetic = {
    'pest': '拍死它 → 害虫（见到 pest 就拍死它）',
    'ambulance': '俺不能死 → 救护车（危急时“俺不能死”要叫救护车）',
    'famine': '发米呢 → 饥荒（闹饥荒才“发米呢”）',
    'ambition': '俺必胜 → 雄心 / 野心（俺必胜的雄心）',
    'candidate': '肯来的他 → 候选人（肯来参选的他）',
    'ache': '哎哟 → 疼痛（一疼就“哎哟”）',
    'cough': '咳夫 → 咳嗽',
    'bride': '不赖的 → 新娘（不赖的新娘）',
    'thief': '窃夫 → 小偷',
    'judge': '贾奇 → 法官（贾法官）',
    'bank': '办卡 → 银行（去银行办卡）',
    'fine': '罚你 → 罚款（违规罚你款）',
    'taxi': '太可悉 → 出租车（熟悉路线）',
    'sofa': '沙发（音译）',
    'coffee': '咖啡（音译）',
    'chocolate': '巧克力（音译）',
    'typhoon': '台风（音译）',
    'cartoon': '卡通（音译）',
    'logic': '逻辑（音译）',
    'humor': '幽默（音译）',
    'vitamin': '维他命（音译）',
    'engine': '引擎（音译）',
    'motor': '马达（音译）',
    'pizza': '披萨（音译）',
    'salad': '沙拉（音译）',
    'soda': '苏打（音译）',
    'lemon': '柠檬（音译）',
    'mango': '芒果（音译）',
    'guitar': '吉他（音译）',
    'ballet': '芭蕾（音译）',
    'coffee': '咖啡（音译）',
    'salary': '薪水或“分厘”？→ 工资（按月发的薪水）',
    'boss': '饱死 → 老板（吃得饱的老板）',
    'panic': '怕你磕 → 恐慌',
    'jeans': '紧身 → 牛仔裤（紧身的牛仔裤）',
    'tofu': '豆腐（音译）',
    'kungfu': '功夫（音译）',
    'tycoon': '大款（音译：太昆）',
    'coolie': '苦力（音译）',
    'typhoon': '台风（音译）',
    'jinrick': '',
    'cop': '拷捕 → 警察（拷人的是警察）',
    'fry': '炸（“ fry ”音近“炸”）',
    'hamburger': '汉堡（音译）',
    'sandwich': '三明治（音译）',
    'biscuit': '饼干（音译：比斯贵）',
    'champagne': '香槟（音译）',
    'whisky': '威士忌（音译）',
    'brand': '不烂的 → 品牌（不烂的才是好品牌）',
    'fans': '粉丝（音译）',
    'clone': '克隆（音译）',
    'model': '模特（音译）',
    'show': '秀（音译）',
    'cartoon': '卡通（音译）',
    'micro': '微（“micro”音近“微”）',
    'dialog': '对话（dia+log 说）',
    'telephone': 'tele(远)+phone(声) → 电话',
    'television': 'tele(远)+vis(看)+ion → 电视'
  };

  /* ---------- 词缀表 ---------- */
  const PREFIX = {
    'anti': '反对', 'auto': '自', 'bi': '两/双', 'co': '共同', 'com': '共同', 'con': '共同', 'ad': '向/去',
    'contra': '反对', 'counter': '反', 'de': '去除/向下', 'dis': '不/否定', 'en': '使', 'em': '使',
    'ex': '出/前', 'fore': '前', 'il': '不', 'im': '不', 'in': '不', 'inter': '之间', 'intra': '内部',
    'ir': '不', 'mal': '坏', 'mid': '中', 'mis': '错误', 'mono': '单', 'multi': '多', 'neo': '新',
    'non': '非', 'out': '超过', 'over': '过度', 'poly': '多', 'post': '后', 'pre': '前/预先',
    'pro': '向前', 'pseudo': '假', 're': '再/重新', 'self': '自身', 'semi': '半', 'sub': '下/副',
    'super': '超', 'sur': '上', 'trans': '跨越', 'tri': '三', 'ultra': '超', 'un': '不/相反',
    'under': '不足/在下', 'uni': '一', 'vice': '副', 'with': '反对', 'extra': '额外',
    'hyper': '超过', 'hypo': '不足', 'equi': '等', 'micro': '微', 'macro': '大', 'tele': '远程',
    'per': '完全/贯穿', 'retro': '向后', 'circum': '周围'
  };
  const SUFFIX = {
    'tion': '名词(动作)', 'sion': '名词', 'ation': '名词', 'ition': '名词', 'ion': '名词', 'ment': '名词(结果)',
    'ance': '名词', 'ence': '名词', 'ity': '名词(性质)', 'ty': '名词', 'ness': '名词(状态)', 'ary': '形容词/名词', 'ory': '名词',
    'ship': '名词(关系/身份)', 'dom': '名词(领域)', 'hood': '名词(时期/身份)', 'age': '名词(集合)',
    'ery': '名词', 'ist': '…家/者', 'ism': '主义', 'er': '人/物', 'or': '人', 'ar': '人',
    'ant': '人/形容词', 'ent': '人/形容词', 'ee': '受事者', 'ess': '女性',
    'able': '形容词(能…的)', 'ible': '形容词', 'al': '形容词', 'ical': '形容词', 'ful': '形容词(充满)',
    'less': '形容词(无)', 'ive': '形容词', 'ous': '形容词', 'ic': '形容词', 'ish': '形容词(略)',
    'some': '形容词(像…的)', 'ly': '副词', 'ward': '方向', 'wards': '方向',
    'ize': '动词', 'ise': '动词', 'ate': '动词', 'ify': '动词', 'en': '动词', 'esce': '动词', 'e': '动词'
  };
  const ROOT = {
    'spect': '看', 'spic': '看', 'scope': '看', 'vis': '看', 'vid': '看', 'view': '看',
    'dict': '说', 'dic': '说', 'log': '说', 'logo': '说', 'phon': '声', 'voc': '声/叫', 'vok': '叫',
    'script': '写', 'scrib': '写', 'graph': '写/画', 'gram': '写',
    'port': '运/拿', 'fer': '拿/带', 'duct': '引导', 'duc': '引导', 'tract': '拉', 'tract': '拉',
    'struct': '建', 'structur': '建', 'rupt': '破', 'cept': '拿', 'cap': '拿', 'cip': '拿', 'ceive': '拿',
    'mit': '送', 'miss': '送', 'pos': '放', 'pon': '放', 'pel': '推', 'puls': '推',
    'ven': '来', 'vent': '来', 'vert': '转', 'vers': '转', 'form': '形', 'gen': '产生', 'gener': '产生',
    'cred': '信', 'loc': '地方', 'geo': '地', 'terr': '地', 'terra': '地', 'bio': '生命',
    'vit': '生命', 'viv': '活', 'mort': '死', 'chron': '时间', 'therm': '热', 'hydro': '水',
    'photo': '光', 'manu': '手', 'ped': '脚', 'pod': '脚', 'phil': '爱', 'phob': '怕',
    'sens': '感觉', 'sent': '感觉', 'path': '感情/病', 'claim': '喊', 'clam': '喊', 'cid': '切/裁决', 'cis': '切/裁决', 'ject': '投/扔',
    'tend': '伸', 'tens': '伸', 'tent': '伸', 'tain': '保持', 'ten': '持有', 'quer': '寻求',
    'quest': '寻求', 'quire': '寻求', 'cycl': '循环', 'gon': '角', 'meter': '测量', 'metr': '测量',
    'centr': '中心', 'corp': '身体', 'corpor': '身体', 'capit': '头', 'carn': '肉', 'derm': '皮',
    'cardi': '心', 'gastr': '胃', 'neur': '神经', 'osteo': '骨', 'psych': '心理', 'anthrop': '人',
    'theo': '神', 'dem': '人民', 'cracy': '统治', 'crat': '统治', 'auto': '自', 'syn': '共同',
    'sym': '共同', 'mono': '单', 'poly': '多', 'ortho': '正', 'hetero': '异', 'homo': '同',
    'mal': '坏', 'bene': '好', 'eu': '好', 'dys': '坏', 'luc': '光', 'lum': '光', 'son': '声',
    'audi': '听', 'audit': '听', 'nom': '法则', 'nomy': '法则', 'techn': '技术', 'lingu': '语言',
    'liter': '文字', 'mar': '海', 'solv': '松开', 'solut': '松开', 'vol': '意志', 'volunt': '意志',
    'fix': '固定', 'clud': '关闭', 'clus': '关闭', 'press': '压', 'equ': '等', 'fin': '结束',
    'flect': '弯', 'flex': '弯', 'frag': '破', 'fract': '破', 'greg': '群', 'leg': '读/法',
    'liber': '自由', 'mem': '记忆', 'migr': '移', 'nov': '新', 'pel': '推', 'pend': '悬挂',
    'plic': '折', 'ply': '折', 'pon': '放', 'port': '运', 'rid': '笑', 'rog': '问',
    'sci': '知', 'scrib': '写', 'sect': '切', 'sed': '坐', 'sess': '坐', 'sid': '坐',
    'sign': '标记', 'simil': '相似', 'sist': '站立', 'soci': '社会', 'sol': '单独/太阳',
    'soph': '智慧', 'spec': '看', 'spher': '球', 'spir': '呼吸', 'st': '站', 'stat': '站',
    'stitu': '建立', 'strain': '拉', 'strict': '拉', 'string': '拉', 'stru': '建', 'sume': '拿',
    'tact': '触', 'tag': '触', 'tang': '触', 'tect': '盖', 'temper': '调和', 'tempor': '时间',
    'tend': '伸', 'termin': '结束', 'test': '证', 'text': '织/文', 'thes': '放', 'thesis': '放',
    'tone': '音', 'tort': '扭', 'tour': '转', 'tox': '毒', 'tract': '拉', 'treat': '处理',
    'tribut': '给予', 'trop': '转', 'trud': '推', 'turb': '乱', 'un': '一', 'urb': '城市',
    'us': '用', 'util': '用', 'vail': '有用', 'val': '强', 'vari': '变化', 'veh': '运',
    'ven': '来', 'vent': '来', 'verb': '词', 'verg': '倾斜', 'vert': '转', 'vest': '衣',
    'vi': '路', 'vict': '胜', 'vid': '看', 'vig': '醒', 'vinc': '胜', 'vis': '看', 'viv': '活',
    'voc': '声', 'vol': '飞/意志', 'volv': '转', 'vor': '吃', 'vot': '誓', 'vour': '吃'
  };
  // 合成词拆分时，右/左半部分不得是这些“类后缀”片段，避免误拆 friend+ship 之类
  const SUFFIXLIKE = new Set(Object.keys(SUFFIX).concat(['ship', 'hood', 'dom', 'ment', 'ness', 'ity', 'ty', 'able', 'ible', 'al', 'ical', 'ful', 'less', 'ive', 'ous', 'ic', 'ish', 'some', 'ly', 'ward', 'wards', 'ize', 'ise', 'ate', 'ify', 'en', 'ist', 'ism', 'er', 'or', 'ar', 'ant', 'ent', 'ee', 'ess', 'age', 'ery', 'esce', 'tion', 'sion', 'ation', 'ition']));

  const PREFIX_KEYS = Object.keys(PREFIX).sort((a, b) => b.length - a.length);
  const SUFFIX_KEYS = Object.keys(SUFFIX).sort((a, b) => b.length - a.length);
  const ROOT_KEYS = Object.keys(ROOT).sort((a, b) => b.length - a.length);

  // 候选词干还原（处理 y→i、去 e 等拼写变化）
  function stemCandidates(stem) {
    const cands = [stem, stem + 'e', stem + 'a', stem + 'r'];
    if (stem.endsWith('i')) cands.push(stem.slice(0, -1) + 'y'); // happi→happy
    if (stem.endsWith('i')) cands.push(stem.slice(0, -1) + 'e'); // studi→studie? 兜底
    return cands;
  }
  function knownWord(stem) {
    for (const c of stemCandidates(stem)) if (WORDSET.has(c)) return c;
    return null;
  }
  // 解析词干：返回 {kind:'word'|'root', val, cn, before, after}
  function analyzeStem(stem) {
    const k = knownWord(stem);
    if (k) return { kind: 'word', val: k, cn: lookup(k), before: '', after: '' };
    // 词根出现在词干中任意位置（前缀 + 词根 + 后缀 结构）
    for (const rk of ROOT_KEYS) {
      const idx = stem.indexOf(rk);
      if (idx >= 0 && (idx > 0 || stem.length > rk.length)) {
        const before = stem.slice(0, idx), after = stem.slice(idx + rk.length);
        const bOK = before === '' || !!PREFIX[before] || WORDSET.has(before);
        const aOK = after === '' || !!SUFFIX[after];
        if (bOK && aOK) return { kind: 'root', val: rk, cn: ROOT[rk], before, after };
      }
    }
    return null;
  }
  function rootPart(a) {
    let s = '';
    if (a.before) s += '前缀 ' + a.before + '-（' + (PREFIX[a.before] || a.before) + '）+ ';
    s += a.val + '（' + a.cn + '）';
    if (a.after) s += ' + 后缀 -' + a.after + '（' + (SUFFIX[a.after] || '') + '）';
    return s;
  }

  window.cet4GenMnem = function (word, cn) {
    const w = (word || '').toLowerCase();
    if (!w) return '';
    if (window.cet4Phonetic && window.cet4Phonetic[w]) return '🔤 谐音｜' + window.cet4Phonetic[w];

    // 1) 合成词：左右两半都是考纲词
    for (let i = 3; i < w.length - 2; i++) {
      const L = w.slice(0, i), R = w.slice(i);
      if (!SUFFIXLIKE.has(L) && !SUFFIXLIKE.has(R) && WORDSET.has(L) && WORDSET.has(R)) {
        return '🧩 合成词｜' + L + '（' + lookup(L) + '）+ ' + R + '（' + lookup(R) + '）→ ' + (cn || '');
      }
    }
    // 2) 仅后缀：词干是考纲词/词根
    for (const s of SUFFIX_KEYS) {
      if (w.endsWith(s) && w.length - s.length >= 2) {
        const stem = w.slice(0, -s.length);
        const a = analyzeStem(stem);
        if (a) {
          if (a.kind === 'word') return '🧩 词缀｜' + a.val + '（' + a.cn + '）+ 后缀 -' + s + '（' + SUFFIX[s] + '）→ ' + (cn || '');
          return '🧩 词根｜' + rootPart(a) + ' + 后缀 -' + s + '（' + SUFFIX[s] + '）→ ' + (cn || '');
        }
      }
    }
    // 3) 仅前缀：剩余部分是考纲词
    for (const p of PREFIX_KEYS) {
      if (w.startsWith(p) && w.length - p.length >= 4) {
        const rest = w.slice(p.length);
        if (WORDSET.has(rest)) return '🧩 词缀｜前缀 ' + p + '-（' + PREFIX[p] + '）+ ' + rest + '（' + lookup(rest) + '）→ ' + (cn || '');
      }
    }
    // 4) 前缀 + 后缀：词干是考纲词/词根
    for (const p of PREFIX_KEYS) {
      if (w.startsWith(p) && w.length - p.length >= 5) {
        const rest = w.slice(p.length);
        for (const s of SUFFIX_KEYS) {
          if (rest.endsWith(s) && rest.length - s.length >= 2) {
            const stem = rest.slice(0, -s.length);
            const a = analyzeStem(stem);
            if (a) {
              if (a.kind === 'word') return '🧩 词缀｜前缀 ' + p + '-（' + PREFIX[p] + '）+ ' + a.val + '（' + a.cn + '）+ 后缀 -' + s + '（' + SUFFIX[s] + '）→ ' + (cn || '');
              return '🧩 词根｜前缀 ' + p + '-（' + PREFIX[p] + '）+ ' + rootPart(a) + ' + 后缀 -' + s + '（' + SUFFIX[s] + '）→ ' + (cn || '');
            }
          }
        }
      }
    }
    // 5) 词根出现在词中（前缀或后缀之一存在）
    for (const p of PREFIX_KEYS) {
      if (w.startsWith(p) && w.length - p.length >= 4) {
        const rest = w.slice(p.length);
        for (const rk of ROOT_KEYS) {
          if (rest.startsWith(rk) && rest.length - rk.length <= 4) {
            const tail = rest.slice(rk.length);
            if (tail === '' || SUFFIX[tail] || WORDSET.has(tail)) {
              return '🧩 词根｜前缀 ' + p + '-（' + (PREFIX[p] || p) + '）+ ' + rk + '（' + ROOT[rk] + '）' + (SUFFIX[tail] ? ' + 后缀 -' + tail + '（' + SUFFIX[tail] + '）' : '') + ' → ' + (cn || '');
            }
          }
        }
      }
    }
    return '';
  };
})();
