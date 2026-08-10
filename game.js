/* 第七码头以北 — standalone static investigation game */
(() => {
  "use strict";
  const SAVE_KEY = "north-of-pier-seven-save-v1";

  const chapters = [
    {n:1,title:"数字 1",date:"2004 / 11 / 19",intro:"唐辉死在电影院后巷。墙上的数字、垃圾桶旁的黑色相纸，以及一通来自公共电话亭的电话，让一个普通夜晚有了被设计过的形状。",dispatch:"先从唐辉的死亡时间与固定路线入手。现场的每一件东西都可能只是垃圾。",objectives:["领取第一案卷宗","调查电影院后巷","调查唐辉酒吧","判断唐辉为何经过后巷"]},
    {n:2,title:"黑色相纸",date:"2004 / 12 / 03",intro:"第二名死者出现在地下排水道，第三名死者倒在废弃旅馆。数字增加，死法改变，媒体已经替你写好了结论：连环杀手。",dispatch:"别只寻找三名死者的身份共同点。比较他们的日常路线。",objectives:["调查第二案现场","调查第三案现场","取得三名死者日程","完成“共同点”推理"]},
    {n:3,title:"第四个人",date:"2004 / 12 / 10",intro:"摄影师林凯成为数字 4。相同的黑色相纸第一次有了自然来源，而他外套中的空底片盒写着：92 / 12 / 18 / 北七。",dispatch:"林凯与前三人不同。问一个更重要的问题：谁才是被藏起来的那个人？",objectives:["勘查河滨仓库","搜查林凯摄影室","确认相纸来源","建立伪装犯罪假说"]},
    {n:4,title:"十二年前",date:"1992 / 12 / 18",intro:"北七印刷厂火灾，死亡四人、失踪一人。官方说是电路老化；被拆掉的第 47 页、卡死的机械门和一卷底片却讲述着另一个版本。",dispatch:"单张照片不构成真相。把时间、门的结构和幸存者证词排成完整序列。",objectives:["调阅 1992 年旧档","调查印刷厂旧址","取得消防门与账本证据","恢复完整底片序列"]},
    {n:5,title:"多出来的第五人",date:"2004 / 12 / 12",intro:"记者魏安死于车辆撞击。数字 5 写得仓促，相纸被临时撕下，电话亭没有提前拨号。第五案看似延续，实则处处中断。",dispatch:"把第五案与前四案逐项对照。魏安不是被选择的，他是发现了什么。",objectives:["调查第五案路口","破解魏安答录机","检查公交总站维修车","判定第五案性质","保护孙倩"]},
    {n:6,title:"第七码头以北",date:"2004 / 12 / 13",intro:"调查从“谁与旧案有关”转向“谁始终拥有机会”。17 路穿过所有案发地点，车辆每次回站后，总有一段无人记录的空白。",dispatch:"完成排班时间线，审讯黄启，然后提交完整案件报告。",objectives:["完成 17 路覆盖推理","重建四案时间窗口","确认黄启与黄志远关系","完成最终报告"]}
  ];

  const evRows = `
E001|唐辉尸检报告|A|警局|死亡时间 23:26—23:34。与末班车交接时间存在重叠窗口。|5
E002|墙上的数字 1|B|电影院后巷|白色粉笔书写。笔画平稳，没有可辨识的符号学含义。|4
E003|黑色相纸 A|A|电影院后巷|完全曝光的旧式相纸，边缘批号被裁去。|4
E004|17 路公交票残角|A|电影院后巷|排水沟内的残票。票面纹路属于临川公交 17 路。|4
E005|唐辉工作记录|B|唐辉酒吧|每周五 23:20 左右关店，固定经后巷回家。|5
E006|唐辉债务记录|C|唐辉酒吧|死者欠有私人债务，但债主在案发时有明确行踪。|3
E007|后巷鞋印|B|电影院后巷|约 42 码防滑工作鞋，无法对应唯一职业。|3
E008|电话记录 1|A|唐辉酒吧|23:21 接到公共电话亭来电，随后唐辉离店。|5
E009|吴峰尸检报告|A|警局|死亡时间约 22:12，死因为溺水。|5
E010|通道内数字 2|B|地下排水道|红色油性笔书写，与第一案媒介不同。|4
E011|黑色相纸 B|A|地下排水道|纸张型号与 E003 相同。|4
E012|维修工具箱|B|地下排水道|工具完整，排除抢劫与普通工作意外。|4
E013|假维修地址纸条|A|地下排水道|“北七巷 17-4”并不存在，死者被电话诱导。|5
E014|电话记录 2|A|吴峰住所|21:54 接到同一公共电话亭来电。|5
E015|地下鞋印|B|地下排水道|工作鞋纹路与后巷相近，但不是唯一型号。|3
E016|赵氏地产施工图|C|吴峰住所|吴峰参与过拆迁管线工程，形成地产报复的误导方向。|3
E017|方蓉尸检报告|A|警局|死亡时间约 21:05，死因为窒息。|5
E018|旅馆墙面数字 3|B|海鸥旅馆|喷漆书写，媒介再次改变。|4
E019|黑色相纸 C|A|海鸥旅馆|批次、切口与前两案相纸吻合。|4
E020|猫粮袋|A|海鸥旅馆|方蓉每周在同一家店固定购买。|4
E021|方蓉日记|A|方蓉住所|每周三、周五晚独自前往旅馆喂猫。|5
E022|反拆迁徽章|C|海鸥旅馆|强烈指向赵氏地产，但摆放位置过于显眼。|2
E023|远距离目击证词|B|海鸥旅馆|居民看见一名穿深色制服外套的人离开。|3
E024|电话记录 3|A|方蓉住所|20:49 公共电话来电但无人接听；案件仍然发生。|5
E025|林凯尸检报告|A|警局|死亡时间 22:46—22:49，失血死亡。|5
E026|仓库墙面数字 4|B|河滨仓库|粉笔书写，与第一案相似。|4
E027|黑色相纸 D|A|河滨仓库|与前三案同批，林凯本人却与摄影有自然关联。|5
E028|林凯相机|A|河滨仓库|相机内胶卷被取走，机身没有被盗。|5
E029|空底片盒|A|河滨仓库|标记“92-12-18 / 北七”，打开十二年前的旧案入口。|5
E030|电话记录 4|A|河滨仓库|22:26 电话亭来电，林凯随即改变路线。|5
E031|林凯工作笔记|A|摄影工作室|“完整序列能证明黄不是纵火者。”|5
E032|被裁切接触样片|A|二手书店|只有黄志远 22:41 入仓的画面，是黄启误会的来源。|5
E033|暗房垃圾袋|A|摄影工作室|大量同型号报废黑色相纸，批号与四案吻合。|5
E034|林凯会面日历|A|摄影工作室|“黄，底片，不交原件。”证明林凯与黄姓人物发生冲突。|5
E035|赵启明名片|C|摄影工作室|赵曾提出购买旧照片，构成合理但错误的现案方向。|3
E036|河滨争吵证词|B|河滨仓库|居民听到两名相互认识的男性争执底片。|3
E037|魏安尸检报告|A|警局|车辆撞击死亡，作案方式与前四案明显不同。|5
E038|仓促的数字 5|A|电话亭路口|倾斜、重复描画，书写节奏与前四个数字不同。|5
E039|撕裂相纸|A|电话亭路口|尺寸不同、边缘新鲜撕裂，是临时伪装。|5
E040|车辆油漆碎片|A|电话亭路口|与公交总站旧维修车漆层一致。|5
E041|魏安记者证|B|电话亭路口|死者正在追查电话记录与公交系统。|4
E042|魏安笔记|A|报社|写有“17 / 返回 / 电话”。|5
E043|魏安录音留言|A|报社|“关键不是电话，是回总站的路。”|5
E044|维修车出入记录|A|公交总站|19:31—20:03 之间记录缺失。|5
E045|维修车轮胎照片|A|公交总站|B 车轮胎纹与路口压痕一致。|5
E046|1992 火灾报道|B|二手书店|官方将北七印刷厂火灾归因于电路老化。|3
E047|原始死亡名单|A|警局旧档|黄志远被列为“失踪”，遗体从未准确辨认。|5
E048|缺页目录|A|警局旧档|目录从 46 直接跳到 48，第 47 页被人为拆除。|5
E049|旧消防平面图|A|印刷厂旧址|消防门是机械结构，不会因停电自动失效。|5
E050|消防门损坏照片|A|电影院地下室|门锁从内部被工具破坏，方向指向救援。|5
E051|林正国采访笔记|A|电影院地下室|记录罗晋川在起火前携带油桶离开档案仓。|5
E052|旧财务账本|A|印刷厂旧址|非法票据资金与火灾后的异常付款。|5
E053|赵启明付款记录|A|赵氏地产|款项经中间账户流向周成哥哥的商店。|5
E054|黄志远员工档案|A|印刷厂旧址|仓库管理员，熟悉消防门与疏散路线。|5
E055|陈岚幸存者记录|B|社区诊所|其母亲是从被破坏的消防门逃出的三人之一。|5
E056|林雪证词草稿|A|电影院地下室|当晚见到罗晋川车辆停在印刷厂外。|4
E057|完整底片序列|A+|摄影工作室暗格|22:41 入仓、22:43 罗离开、22:46 起火、22:47 破门、22:48 工人逃生。|5
E058|罗晋川死亡记录|B|二手书店|印刷厂长于 1997 年病亡。|5
E059|周成修改报告|A|警局旧档|删除“消防门人为损坏”并改写证物登记。|5
E060|消防门维修单|A|印刷厂旧址|火灾前门锁已存在机械故障。|5
E061|17 路线路图|A|公交总站|五个案发地点均在合理步行覆盖范围。|5
E062|黄启排班表|A|公交总站|前四案黄启全部值晚班。|5
E063|车辆回站记录|A|公交总站|四次电话均在车辆回站后 3—8 分钟拨出。|5
E064|制服领用记录|B|公交总站|黄启领用深蓝冬季制服，吻合第三案目击。|4
E065|工作鞋型号|B|公交总站|防滑纹路吻合现场，但该型号并非黄启独有。|3
E066|电话亭地图|A|公共电话亭|电话亭距 17 路总站仅约 3 分钟步行。|5
E067|维修钥匙表|A|公交总站|黄启拥有取得第五案维修车钥匙的权限。|5
E068|换班异常记录|A|公交总站|第四案当晚黄启多出约 14 分钟无记录空档。|5
E069|许文调查笔记|B|二手书店|多年追查旧案，但错误地将赵启明视为唯一主谋。|3
E070|陈岚旧合照|B|社区诊所|陈岚与火灾幸存者家庭的联系。|4
E071|林雪旧照片|B|老电影院|赵启明年轻时频繁出入印刷厂。|4
E072|孙倩调查表|A|报社|林凯与魏安曾共享资料，孙倩是下一名潜在知情人。|5
E073|黄启父子照片|A|公交总站|照片背面写有“黄启与父亲黄志远，1991”。|5
E074|周成旧警员证|B|周成警务室|证明周成 1992 年已经参与火灾现场记录。|4
E075|赵氏地产名单|C|赵氏地产|三名受害者与拆迁均有松散关系，但不足以解释林凯。|2`;

  const evidence = Object.fromEntries(evRows.trim().split("\n").map(row => {
    const [id,name,grade,source,desc,stars] = row.split("|");
    return [id,{id,name,grade,source,desc,stars:+stars}];
  }));

  const people = [
    {id:"chen",name:"陈岚",age:34,job:"社区诊所医生",initial:"岚",suspicion:42,bio:"十二年前火灾的幸存儿童之一。对火灾表现出异常紧张，曾向林凯购买旧照片。",truth:"知道火灾并非普通事故，但不知道纵火者身份。",rounds:["我只是恰好经过后巷。过去的事和唐辉没有关系。","那场火不是电路问题。我母亲从消防门逃了出来，有人从里面砸开了门。","黄志远不是凶手。没有他，我母亲活不到今天。"]},
    {id:"zhou",name:"周成",age:47,job:"社区警务室警察",initial:"周",suspicion:82,bio:"主动提供资料、熟悉街区历史，也在不断替调查员选择方向。",truth:"修改并销毁过旧案材料，但不是现案凶手。",rounds:["我很多年没去过印刷厂了。","我只是路过旧址。档案缺页也许是保管不当。","报告是我改的。赵启明给了钱。我有罪，但那五个人不是我杀的。"]},
    {id:"xu",name:"许文",age:31,job:"二手书店老板",initial:"许",suspicion:36,bio:"父亲死于火灾，私下积累了大量资料；笔记中也混有多年形成的错误判断。",truth:"重要信息源。他对赵启明的执念既是误导，也引出了账本。",rounds:["我父亲不是死于事故。有人让所有人闭嘴。","林凯来过，他把一张裁切的接触样片留给我保管。","完整照片不在我这里。但林凯说过：只看一张，会把救人者当成凶手。"]},
    {id:"sun",name:"孙倩",age:26,job:"《临川晚报》记者",initial:"倩",suspicion:12,bio:"魏安同事，也是潜在受害者。她会继续追查公交总站，除非警方保护她。",truth:"掌握魏安留言与记者共享资料，可在最终行动中存活或成为第六名受害者。",rounds:["魏安说电话亭只是表面，他把数字 17 圈了三次。","林凯、魏安和我共享一份资料。林凯准备公开 1992 年照片。","我可以把底片交给你，但我要看着它进入证物袋。"]},
    {id:"zhao",name:"赵启明",age:61,job:"地产开发商",initial:"赵",suspicion:76,bio:"十二年前任印刷厂财务负责人，现推动街区拆迁，多名死者与其利益冲突。",truth:"参与掩盖旧案、长期收买知情者，但不是现案凶手。",rounds:["拆迁有争议不等于杀人。林凯的照片，我只是想买下来。","罗晋川说只烧账本。我没想到火会失控。","钱是我付的，周成改了报告。黄志远不是我们的人。"]},
    {id:"huang",name:"黄启",age:38,job:"17 路公交司机",initial:"启",suspicion:18,bio:"多次出现在监控中，却一直被当作普通证人；熟悉街区每个居民的生活节奏。",truth:"黄志远之子，也是五案真凶。因误读裁切照片而杀害唯一能证明父亲清白的人。",rounds:["开末班车当然会经过那些地方。我不认识死者。","排班不是我定的。总站附近那么多人……我不认识林凯。","我只看到他进仓。他们会再说我爸纵火。我不能让那卷照片出去。"]},
    {id:"lin",name:"林雪",age:59,job:"老电影院管理员",initial:"雪",suspicion:31,bio:"记忆力很好，知道许多旧建筑细节，却因与赵启明的私人关系隐瞒信息。",truth:"见到过罗晋川车辆，地下室保存着林正国遗留档案。",rounds:["十二年前的事，记得太清楚不一定是好事。","那晚我看见一辆车，但我不能确定是谁。","是罗晋川的车。赵启明求我别说，我把证词藏在地下室。"]}
  ];

  const locations = [
    {id:"office",name:"警局专案办公室",ch:1,x:10,y:10,theme:"archive",desc:"领取尸检、调阅旧档、整理正式卷宗。",spots:[
      {n:"现案卷宗柜",x:22,y:34,ids:["E001","E009","E017","E025","E037"]},{n:"1992 年旧档",x:62,y:54,ids:["E047","E048","E059"]}]},
    {id:"alley",name:"电影院后巷",ch:1,x:26,y:22,theme:"alley",desc:"第一案现场。潮湿砖墙、排水沟与被封锁的垃圾区。",spots:[
      {n:"墙面粉笔",x:18,y:28,ids:["E002"]},{n:"垃圾桶",x:70,y:60,ids:["E003"]},{n:"排水沟",x:43,y:82,ids:["E004"]},{n:"鞋印",x:82,y:76,ids:["E007"]}]},
    {id:"bar",name:"唐辉酒吧",ch:1,x:18,y:40,theme:"hotel",desc:"唐辉经营十年的小酒吧，打烊记录还夹在收银机下。",spots:[
      {n:"排班本",x:28,y:35,ids:["E005"]},{n:"办公室抽屉",x:72,y:45,ids:["E006"]},{n:"固定电话",x:53,y:72,ids:["E008"]}]},
    {id:"sewer",name:"地下排水通道",ch:2,x:38,y:67,theme:"sewer",desc:"第二案现场。水声盖住了大部分动静。",spots:[
      {n:"现场勘查包",x:24,y:70,ids:["E009","E010","E011"]},{n:"工具箱",x:55,y:62,ids:["E012","E013"]},{n:"入口记录",x:78,y:26,ids:["E014","E015"]}]},
    {id:"fanghome",name:"方蓉住所",ch:2,x:16,y:72,theme:"archive",desc:"整洁的小屋，墙上贴着学校课表和喂猫日程。",spots:[
      {n:"书桌日记",x:30,y:42,ids:["E021","E024"]},{n:"施工文件",x:70,y:66,ids:["E016"]}]},
    {id:"hotel",name:"废弃海鸥旅馆",ch:2,x:50,y:44,theme:"hotel",desc:"第三案现场。猫粮散在布满灰尘的地板上。",spots:[
      {n:"三号房",x:20,y:34,ids:["E017","E018","E019"]},{n:"窗边猫粮",x:61,y:68,ids:["E020"]},{n:"后门",x:84,y:45,ids:["E022","E023"]}]},
    {id:"warehouse",name:"河滨仓库",ch:3,x:72,y:26,theme:"warehouse",desc:"第四案现场，也是林凯被约来的地方。",spots:[
      {n:"尸体位置",x:32,y:72,ids:["E025","E026","E027"]},{n:"破损相机",x:62,y:64,ids:["E028","E029"]},{n:"墙边电话记录",x:79,y:32,ids:["E030","E036"]}]},
    {id:"studio",name:"林凯摄影工作室",ch:3,x:57,y:15,theme:"archive",desc:"暗房仍有显影液气味。一个墙柜背板发出空响。",spots:[
      {n:"工作台",x:25,y:38,ids:["E031","E034"]},{n:"暗房垃圾",x:72,y:68,ids:["E033"]},{n:"文件抽屉",x:57,y:26,ids:["E035"]},{n:"墙柜暗格",x:84,y:43,ids:["E057"]}]},
    {id:"bookstore",name:"二手书店",ch:3,x:36,y:35,theme:"archive",desc:"许文把十二年的报纸、照片和猜测塞满了整个后屋。",spots:[
      {n:"防潮照片袋",x:33,y:57,ids:["E032"]},{n:"旧报纸架",x:68,y:38,ids:["E046","E058"]},{n:"调查笔记",x:78,y:73,ids:["E069"]}]},
    {id:"printworks",name:"北七印刷厂旧址",ch:4,x:60,y:61,theme:"print",desc:"烧毁的厂房即将拆除，机械消防门的残骸还留在墙里。",spots:[
      {n:"消防门",x:18,y:42,ids:["E049","E060"]},{n:"办公室废墟",x:63,y:68,ids:["E052","E054"]},{n:"装订室",x:82,y:31,ids:[]}]},
    {id:"basement",name:"电影院地下室",ch:4,x:27,y:16,theme:"archive",desc:"林雪保存了摄影记者林正国未被收走的资料。",spots:[
      {n:"旧照片箱",x:28,y:56,ids:["E050"]},{n:"记者文件袋",x:72,y:37,ids:["E051","E056"]},{n:"私人相册",x:80,y:74,ids:["E071"]}]},
    {id:"clinic",name:"社区诊所",ch:4,x:10,y:55,theme:"archive",desc:"陈岚拒绝谈自己，却保存着母亲的烧伤随访记录。",spots:[
      {n:"病历柜",x:34,y:40,ids:["E055"]},{n:"旧合照",x:70,y:63,ids:["E070"]}]},
    {id:"news",name:"《临川晚报》报社",ch:5,x:44,y:18,theme:"archive",desc:"魏安的桌面停在他离开时的样子，答录机等待四位密码。",spots:[
      {n:"魏安笔记本",x:25,y:62,ids:["E042"]},{n:"答录机",x:62,y:45,ids:[]},{n:"共享资料表",x:81,y:68,ids:["E072"]}]},
    {id:"booth",name:"公共电话亭路口",ch:1,x:70,y:47,theme:"booth",desc:"位于 17 路终点站旁。第五案后，这里从线索变成现场。",spots:[
      {n:"电话机",x:30,y:38,ids:["E066"]},{n:"第五案现场",x:70,y:72,ids:["E038","E039","E040","E041"]}]},
    {id:"bus",name:"17 路公交总站",ch:5,x:84,y:49,theme:"bus",desc:"车辆、排班与整座街区的夜间节奏在这里汇合。",spots:[
      {n:"调度办公室",x:26,y:35,ids:["E061","E062","E063","E068"]},{n:"维修车库",x:67,y:67,ids:["E044","E045","E067"]},{n:"更衣柜",x:81,y:31,ids:["E064","E065","E073"]}]},
    {id:"zhao",name:"赵氏地产办公室",ch:2,x:8,y:28,theme:"archive",desc:"新楼盘模型覆盖着旧厂区地图，旧账被藏在项目文件里。",spots:[
      {n:"旧项目账目",x:32,y:44,ids:["E053"]},{n:"拆迁名单",x:70,y:62,ids:["E075"]}]},
    {id:"police",name:"周成警务室",ch:2,x:29,y:83,theme:"archive",desc:"周成的个人柜中有一张入职初期的旧警员证。",spots:[
      {n:"个人文件柜",x:50,y:48,ids:["E074"]}]}
  ];

  const deductions = [
    {id:"T01",name:"受害者可被预测",need:["E005"],desc:"唐辉每周五固定时间经过后巷。"},
    {id:"T02",name:"方蓉固定夜间路线",need:["E020","E021"],desc:"喂猫时间与地点长期固定。"},
    {id:"T03",name:"前三人共同规律",need:["E005","E013","E021"],desc:"身份不同，但都能被长期观察并预测。"},
    {id:"T04",name:"伪装式连环犯罪",need:["E027","E033"],desc:"相纸来自真正目标的暗房，被复制进其他案件。"},
    {id:"T05",name:"第五案不在原计划",need:["E038","E039","E043"],desc:"临时灭口被仓促伪装成第五起连环案件。"},
    {id:"T06",name:"公共电话共同来源",need:["E008","E014","E024","E030"],desc:"电话是行动便利，不是仪式。"},
    {id:"T07",name:"不完整信息造成误会",need:["E032","E057"],desc:"黄启只看到了父亲入仓的第一张照片。"},
    {id:"T08",name:"1992 报告被伪造",need:["E050","E052","E059"],desc:"纵火、破门与事后掩盖被改写成电路事故。"},
    {id:"T09",name:"17 路观察者假说",need:["E005","E021","E061"],desc:"司机可长期观察三名伪装受害者。"},
    {id:"T10",name:"黄志远破门救人",need:["E050","E055"],desc:"破坏方向与幸存者证词相互印证。"}
  ];

  function freshState(){return {chapter:1,evidence:[],deductions:[],visited:[],spots:[],puzzles:[],interviews:{},selected:[],notes:"",pressure:12,wrong:0,sunSafe:false,timeline:false,photo:false,ending:null,actions:0};}
  let state = freshState();
  let activeView = "desk", activeLocation = null;

  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const titleScreen = $("#title-screen"), shell = $("#game-shell"), root = $("#view-root"), modal = $("#modal"), modalBody = $("#modal-body");
  const has = id => state.evidence.includes(id), hasD = id => state.deductions.includes(id), spotKey = (l,i) => `${l}:${i}`;
  const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  function save(silent=true){localStorage.setItem(SAVE_KEY,JSON.stringify(state)); if(!silent) toast("调查档案已写入本地存储");}
  function load(){try{const parsed=JSON.parse(localStorage.getItem(SAVE_KEY));if(parsed) state={...freshState(),...parsed};}catch{} }
  function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2200);$("#ticker-text").textContent=msg;}
  function openModal(label,html){$("#modal-label").textContent=label;modalBody.innerHTML=html;modal.showModal();}
  function closeModal(){modal.close();}
  function addEvidence(ids, message=true){const added=[];ids.forEach(id=>{if(evidence[id]&&!has(id)){state.evidence.push(id);added.push(id);}});if(added.length&&message)toast(`证物入库：${added.join(" / ")}`);save();updateChrome();return added;}
  function addDeduction(id){if(!hasD(id)){state.deductions.push(id);toast(`形成新推论：${deductions.find(x=>x.id===id)?.name||id}`);save();updateChrome();}}
  function addPuzzle(id){if(!state.puzzles.includes(id)){state.puzzles.push(id);save();}}
  function action(cost=1){state.actions+=cost;state.pressure=Math.min(40,state.pressure+cost);save();}

  function progress(){return Math.min(99,Math.round((state.chapter-1)*16.5 + state.evidence.length*.28 + state.deductions.length*1.3 + state.puzzles.length*.6));}
  function trust(){const score=state.evidence.filter(id=>["A","A+"].includes(evidence[id]?.grade)).length+state.deductions.length*2-state.wrong*2;return score>35?"高":score>15?"中":"低";}
  function objectiveDone(i){const c=state.chapter;const checks={
    1:[has("E001"),has("E002")&&has("E003"),has("E005")&&has("E008"),hasD("T01")],
    2:[has("E009")&&has("E013"),has("E017")&&has("E019"),has("E005")&&has("E021"),hasD("T03")],
    3:[has("E025")&&has("E029"),has("E031")&&has("E033"),hasD("T04"),hasD("T04")],
    4:[has("E047")&&has("E048"),has("E049")&&has("E060"),has("E050")&&has("E052"),state.photo],
    5:[has("E038")&&has("E040"),has("E043"),has("E044")&&has("E045"),hasD("T05"),state.sunSafe],
    6:[hasD("T09"),state.timeline,has("E073"),!!state.ending]
  };return checks[c][i];}
  function canAdvance(){const count=chapters[state.chapter-1].objectives.length;return Array.from({length:count},(_,i)=>objectiveDone(i)).every(Boolean);}
  function updateChrome(){
    const ch=chapters[state.chapter-1];$("#game-date").textContent=ch.date;$("#metric-progress").textContent=progress()+"%";$("#metric-trust").textContent=trust();$("#metric-pressure").textContent=state.pressure;$("#evidence-count").textContent=state.evidence.length;$("#chapter-chip").textContent=`第${["一","二","三","四","五","六"][state.chapter-1]}章 / ${ch.title}`;$("#dispatch-text").textContent=ch.dispatch;
    $("#objective-list").innerHTML=ch.objectives.map((o,i)=>`<div class="objective ${objectiveDone(i)?"done":""}">${o}</div>`).join("");
    $("#report-nav").classList.toggle("locked",state.chapter<6);
  }

  const views={
    desk:{k:"CASE OVERVIEW",t:"案件桌面"},map:{k:"DISTRICT NODE MAP",t:"城区地图"},people:{k:"PERSONS OF INTEREST",t:"人物资料"},evidence:{k:"EVIDENCE ARCHIVE",t:"证物库"},timeline:{k:"EVENT RECONSTRUCTION",t:"时间线"},board:{k:"DEDUCTION WORKSPACE",t:"推理板"},notes:{k:"INVESTIGATOR MEMO",t:"调查笔记"},report:{k:"FINAL CASE REPORT",t:"案件报告"}
  };
  function navigate(view){if(view==="report"&&state.chapter<6){toast("最终报告尚未获准建立");return;}activeView=view;activeLocation=null;$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));$("#view-kicker").textContent=views[view].k;$("#view-title").textContent=views[view].t;render();}
  function render(){updateChrome();if(activeLocation){renderLocation(activeLocation);return;}({desk:renderDesk,map:renderMap,people:renderPeople,evidence:renderEvidence,timeline:renderTimeline,board:renderBoard,notes:renderNotes,report:renderReport}[activeView])();}

  function renderDesk(){const ch=chapters[state.chapter-1];const victims=["唐辉 · 11/19 · 重击","吴峰 · 11/26 · 溺水","方蓉 · 12/03 · 窒息","林凯 · 12/10 · 失血","魏安 · 12/12 · 车辆撞击"];
    root.innerHTML=`<div class="chapter-hero"><div><p class="eyebrow">CHAPTER ${String(ch.n).padStart(2,"0")}</p><h3>${ch.title}</h3><p>${ch.intro}</p></div><div class="chapter-number">${ch.n}</div></div>
      <div class="desk-row"><section class="card"><span class="file-ref">VICTIM INDEX / VERIFIED</span><h3>五名死者</h3><div class="case-list">${victims.map((v,i)=>`<div class="case-row" style="opacity:${state.chapter>=Math.min(5,i+1)?.98:.2}"><span class="num">${i+1}</span><div><b>${v.split(" · ")[0]}</b><small>${v.split(" · ").slice(1).join(" / ")}</small></div><em>${state.chapter>=Math.min(5,i+1)?"已建档":"封存"}</em></div>`).join("")}</div></section>
      <section><div class="card"><span class="file-ref">CHAPTER CONTROL</span><h3>阶段核查</h3><p>${canAdvance()?"本章必要调查已完成。可以推进案情。":"完成右侧列出的调查目标。错误方向不会阻止调查，但会影响最终评级。"}</p><div class="action-row"><button class="action" data-desk="intake">领取当前案卷</button>${state.chapter<6?`<button class="action primary" data-desk="advance" ${canAdvance()?"":"disabled"}>结束本章</button>`:`<button class="action primary" data-nav="report">提交案件报告</button>`}</div></div>
      <div class="card" style="margin-top:15px"><span class="file-ref">ACTIVE THEORY</span><h3>${hasD("T04")?"连环案可能是伪装":hasD("T03")?"受害者因可预测而被选中":"共同模式尚未解释"}</h3><p>${hasD("T04")?"真正目标被隐藏在三个随机死者之中。":hasD("T03")?"职业、年龄与社会关系不同；固定生活节奏才是共同点。":"不要急着给数字和相纸赋予意义。"}</p></div></section></div>`;
  }
  function intake(){const packs={1:["E001"],2:["E009","E017"],3:["E025"],4:["E047"],5:["E037"],6:["E061"]};addEvidence(packs[state.chapter]);action();render();}
  function advance(){if(!canAdvance())return; if(state.chapter<6){state.chapter++;action(2);save();toast(`新章节解锁：${chapters[state.chapter-1].title}`);navigate("desk");}}

  function renderMap(){root.innerHTML=`<div class="section-intro"><p>地点节点随案件推进解锁。首次访问地点会推进一次调查行动；场景内普通热点不消耗行动。</p><span class="tag">已访问 ${state.visited.length} / 17</span></div><div class="map-board">${locations.map((l,i)=>`<button class="map-node ${l.ch>state.chapter?"locked":""} ${state.visited.includes(l.id)?"visited":""}" data-loc="${l.id}" style="left:${Math.min(l.x,82)}%;top:${Math.min(l.y,88)}%" ${l.ch>state.chapter?"disabled":""}>${String(i+1).padStart(2,"0")} ${l.name}</button>`).join("")}</div>`;}
  function renderLocation(id){const l=locations.find(x=>x.id===id);if(!l)return;activeLocation=id;if(!state.visited.includes(id)){state.visited.push(id);action();save();}
    root.innerHTML=`<button class="back-link" data-back-map>← 返回城区地图</button><div class="scene"><div class="scene-canvas" data-theme="${l.theme}"><span class="scene-label">SCENE ${l.id.toUpperCase()} / ${l.name}</span><div class="scene-silhouette"></div>${l.spots.map((s,i)=>`<button class="hotspot ${state.spots.includes(spotKey(id,i))?"found":""}" style="left:${s.x}%;top:${s.y}%" data-spot="${i}" aria-label="调查 ${s.n}"></button>`).join("")}</div><aside class="scene-side"><p class="file-ref">LOCATION DOSSIER</p><h3>${l.name}</h3><p>${l.desc}</p><div class="hotspot-log">${l.spots.map((s,i)=>`<div class="${state.spots.includes(spotKey(id,i))?"found":""}">${state.spots.includes(spotKey(id,i))?"■":"□"} ${s.n}</div>`).join("")}</div></aside></div>`;}
  function evidenceChapter(id){const n=+id.slice(1);if(n<=8)return 1;if(n<=24)return 2;if(n<=36)return 3;if(n<=45)return 5;if(n<=60)return 4;if(n<=68)return 5;if(n===69)return 3;if([70,71,74].includes(n))return 4;if(n===72||n===73)return 5;return 2;}
  function inspectSpot(index){const l=locations.find(x=>x.id===activeLocation),s=l.spots[index],key=spotKey(l.id,index);if(!state.spots.includes(key))state.spots.push(key);const eligible=s.ids.filter(id=>evidenceChapter(id)<=state.chapter&&id!=="E057");addEvidence(eligible,false);save();
    if(l.id==="news"&&index===1&&!has("E043")){showAnswerMachine();return;}
    if(l.id==="studio"&&index===3&&!state.photo){if(state.chapter<4){openModal("墙柜暗格",`<h3>一卷严重曝光的底片</h3><p>当前设备无法恢复影像。需要先调阅 1992 年档案，建立参照时间。</p>`);renderLocation(l.id);return;}showPhotoPuzzle();return;}
    const items=eligible.map(id=>evidence[id]).filter(Boolean);openModal("现场勘查 / "+s.n,`<span class="stamp">${l.name}</span><h3>${s.n}</h3>${items.length?items.map(e=>`<div class="document"><span class="file-ref">${e.id} / 等级 ${e.grade}</span><h3>${e.name}</h3><p>${e.desc}</p></div>`).join("<div class='divider'></div>"):`<p>当前阶段未发现可独立入库的证物。环境观察已经记录。</p>`}`);renderLocation(l.id);}

  function renderPeople(){root.innerHTML=`<div class="section-intro"><p>人物口供的可信度低于物证。每轮审讯推进一项行动；后续口供会随章节与证据开放。</p><span class="tag amber">不要过早出示底牌</span></div><div class="grid grid-3">${people.map((p,i)=>{const r=state.interviews[p.id]||0;return `<article class="card person-card"><div class="portrait">${p.initial}</div><span class="person-index">${String(i+1).padStart(2,"0")}</span><h3>${p.name}</h3><p>${p.age} 岁 / ${p.job}</p><p>${p.bio}</p><div>${r?`<span class="tag">已审讯 ${r}/3</span>`:"<span class='tag dim'>尚未审讯</span>"}${p.id==="huang"&&state.chapter<6?"<span class='tag red'>仅作证人</span>":""}</div><div class="suspect-meter"><i style="width:${p.suspicion}%"></i></div><div class="action-row"><button class="action" data-person="${p.id}">进行第 ${Math.min(r+1,3)} 轮</button></div></article>`}).join("")}</div>`;}
  function interview(id){const p=people.find(x=>x.id===id);let r=state.interviews[id]||0;if(id==="huang"&&state.chapter<6){toast("尚无权限对黄启进行正式审讯");return;}if(r>=3){openModal("人物结论",`<h3>${p.name}</h3><p>${p.truth}</p>`);return;}if(r===1&&state.chapter<3){toast("需要更多矛盾证据才能进入第二轮");return;}if(r===2&&state.chapter<5){toast("第三轮审讯需等待旧案证据完整");return;}r++;state.interviews[id]=r;action();save();openModal(`审讯记录 / 第 ${r} 轮`,`<span class="stamp">口供可信度 ★★</span><h3>${p.name}</h3><p>“${p.rounds[r-1]}”</p><div class="callout">调查员批注：${r===1?"记录陈述，暂不采信。":r===2?"口供与已知证据存在可核查矛盾。":"最终陈述已归档。"}</div>`);renderPeople();}

  function gradeClass(g){return g==="A"||g==="A+"?"core":g==="B"?"link":g==="C"?"mislead":"";}
  function renderEvidence(){
    const owned=state.evidence.map(id=>evidence[id]).filter(Boolean);
    const intro=`<div class="section-intro"><p>证据等级表示用途，不等于事实可靠性。A 为核心、B 为关联、C 为合理误导；星级表示来源可信程度。</p><span class="tag">${owned.length} / 75 已入库</span></div>`;
    if(!owned.length){root.innerHTML=intro+`<div class="empty">尚无证物入库。请先访问案发地点。</div>`;return;}
    const cards=owned.map(e=>`<article class="card evidence-card ${gradeClass(e.grade)} ${state.selected.includes(e.id)?"selected":""}" data-evidence="${e.id}"><div class="evidence-icon">${e.id.slice(1)}</div><span class="file-ref">${e.id} / ${"★".repeat(e.stars)}${"☆".repeat(5-e.stars)}</span><h3>${e.name}</h3><p>${e.source}</p></article>`).join("");
    const selection=state.selected.length?`已选择：${state.selected.join(" + ")}`:"选择最多 5 件证物进行组合分析";
    root.innerHTML=intro+`<div class="grid grid-3">${cards}</div><div class="combine-tray"><span>${selection}</span><div class="action-row" style="margin:0"><button class="action" data-clear-selection>清空</button><button class="action primary" data-combine>组合分析</button></div></div>`;
  }
  function selectEvidence(id){if(state.selected.includes(id))state.selected=state.selected.filter(x=>x!==id);else if(state.selected.length<5)state.selected.push(id);else toast("一次最多选择 5 件证物");renderEvidence();}
  function combine(){const match=deductions.find(d=>!hasD(d.id)&&d.need.every(id=>state.selected.includes(id)));if(match){addDeduction(match.id);state.selected=[];save();renderEvidence();return;}const possible=deductions.find(d=>!hasD(d.id)&&d.need.every(id=>has(id))&&d.need.some(id=>state.selected.includes(id)));state.wrong++;state.pressure=Math.min(40,state.pressure+1);save();openModal("组合分析",`<h3>未形成有效推论</h3><p>这些证物之间缺少足够明确的逻辑桥梁。</p>${possible?`<div class="callout">提示：围绕“${possible.name}”，还可尝试 ${possible.need.length} 件相关证物。</div>`:""}`);updateChrome();}

  const timelineEvents=[{e:"唐辉案：17 路回站",a:"23:18"},{e:"唐辉案：电话亭拨号",a:"23:21"},{e:"林凯离开书店",a:"22:14"},{e:"17 路经过七码头",a:"22:18"},{e:"林凯案：电话亭拨号",a:"22:26"},{e:"林凯遭袭",a:"22:47"}];
  function renderTimeline(){if(state.chapter<3){root.innerHTML=`<div class="empty">精确时间线将在第四名死者出现后开放。</div>`;return;}const times=["20:46","21:51","22:14","22:18","22:21","22:26","22:47","23:18","23:21","23:31"];root.innerHTML=`<div class="section-intro"><p>为六个事件选择准确时间。完整时间线会证明公交车辆回站与电话亭拨号之间存在稳定窗口。</p><span class="tag ${state.timeline?"amber":""}">${state.timeline?"已验证":"待重建"}</span></div><div class="timeline-form">${timelineEvents.map((x,i)=>`<div class="timeline-event" data-time="${String(i+1).padStart(2,"0")}"><b>${x.e}</b><select data-time-select="${i}"><option value="">选择时间</option>${times.map(t=>`<option ${state.timeline&&t===x.a?"selected":""}>${t}</option>`).join("")}</select></div>`).join("")}</div><div class="action-row"><button class="action primary" data-check-timeline>核对时间线</button></div>`;}
  function checkTimeline(){const vals=$$("[data-time-select]").map(s=>s.value);if(vals.every((v,i)=>v===timelineEvents[i].a)){state.timeline=true;addPuzzle("13");addDeduction("T09");save();toast("时间线验证完成：黄启四次都具备机会");renderTimeline();}else{state.wrong++;save();toast("时间线存在冲突，请重新核对卷宗");}}

  const puzzles=[
    {id:"01",ch:1,name:"公交票残角",q:"残票属于哪条线路？",opts:["12 路","17 路","23 路"],a:1,reward:["E004"]},
    {id:"02",ch:1,name:"唐辉行动路线",q:"唐辉被选择的关键是什么？",opts:["债务","固定下班路线","酒吧身份"],a:1,d:"T01"},
    {id:"03",ch:2,name:"假维修地址",q:"北七巷 17-4 的核查结果？",opts:["已拆迁","从未存在","门牌错误"],a:1,reward:["E013"]},
    {id:"04",ch:2,name:"前三人共同点",q:"职业年龄各异，真正共同点是？",opts:["反拆迁","旧案亲属","固定时间、路线且独行"],a:2,d:"T03"},
    {id:"05",ch:3,name:"黑色相纸来源",q:"同批相纸来自哪里？",opts:["印刷厂","林凯暗房垃圾","警方物证室"],a:1,d:"T04"},
    {id:"06",ch:4,name:"1992 档案缺页",q:"目录 46 后直接是 48，装订孔有撕裂。",opts:["自然脱落","编号错误","人为拆除"],a:2,reward:["E048"]},
    {id:"07",ch:4,name:"火灾平面图",q:"旧报告称停电导致消防门失效，问题在哪？",opts:["门是机械结构","消防门不存在","电源在室外"],a:0,d:"T08"},
    {id:"08",ch:4,name:"旧照片时间排序",custom:"photo"},
    {id:"09",ch:4,name:"财务账本",q:"ZC-92-12 最终流向？",opts:["陈岚诊所","周成关联账户","林正国报社"],a:1,reward:["E053"]},
    {id:"10",ch:5,name:"第五案异常对比",q:"第五案最准确的性质是？",opts:["模仿犯罪","临时灭口","交通意外"],a:1,d:"T05"},
    {id:"11",ch:5,name:"魏安答录机",custom:"phone"},
    {id:"12",ch:5,name:"公交线路覆盖",q:"哪条路线覆盖全部案发地点？",opts:["12 路","17 路","31 路"],a:1,d:"T09"},
    {id:"13",ch:6,name:"排班时间窗口",custom:"timeline"},
    {id:"14",ch:6,name:"第五案车辆匹配",q:"轮胎、油漆与缺失记录对应哪辆车？",opts:["维修 A 车","维修 B 车","维修 C 车"],a:1,reward:["E045","E067"]},
    {id:"15",ch:6,name:"最终案件重建",custom:"report"}
  ];
  function renderBoard(){root.innerHTML=`<div class="board-layout"><div class="board-canvas">${deductions.map(d=>`<div class="theory-note ${hasD(d.id)?"":"locked"}"><strong>${hasD(d.id)?d.name:"[ 推论未建立 ]"}</strong>${hasD(d.id)?d.desc:`需要 ${d.need.length} 件证物组合`}</div>`).join("")}</div><aside class="theory-panel"><h3>核心谜题</h3><p class="file-ref">SOLVED ${state.puzzles.length} / 15</p>${puzzles.filter(p=>p.ch<=state.chapter).map(p=>`<div class="deduction"><b>${state.puzzles.includes(p.id)?"■":"□"} ${p.id} ${p.name}</b><small>${state.puzzles.includes(p.id)?"已完成":"可尝试分析"}</small><div class="action-row"><button class="action btn-small" data-puzzle="${p.id}">${state.puzzles.includes(p.id)?"复核":"开始"}</button></div></div>`).join("")}</aside></div>`;}
  function startPuzzle(id){const p=puzzles.find(x=>x.id===id);if(p.custom==="photo"){showPhotoPuzzle();return;}if(p.custom==="phone"){showAnswerMachine();return;}if(p.custom==="timeline"){closeModal();navigate("timeline");return;}if(p.custom==="report"){closeModal();navigate("report");return;}openModal(`谜题 ${p.id} / ${p.name}`,`<h3>${p.q}</h3><div class="action-row">${p.opts.map((o,i)=>`<button class="action" data-answer="${p.id}:${i}">${o}</button>`).join("")}</div>`);}
  function answerPuzzle(pid,choice){const p=puzzles.find(x=>x.id===pid);if(+choice===p.a){addPuzzle(pid);if(p.reward)addEvidence(p.reward);if(p.d)addDeduction(p.d);closeModal();toast(`谜题完成：${p.name}`);render();}else{state.wrong++;state.pressure++;save();toast("这个结论无法解释全部证据");updateChrome();}}
  function showAnswerMachine(){openModal("谜题 11 / 魏安答录机",`<h3>请输入四位密码</h3><p>桌上的日期：1119 / 1126 / 1203。便签提示只有三个字：<b>“下一次”</b>。</p><input id="phone-code" maxlength="4" inputmode="numeric" placeholder="0000" style="background:#0e1716;border:1px solid #52685f;color:white;padding:12px;font:22px var(--mono);letter-spacing:.4em"><div class="action-row"><button class="action primary" data-phone-submit>播放留言</button></div>`);}
  function solvePhone(){if($("#phone-code").value==="1210"){addPuzzle("11");addEvidence(["E043"]);closeModal();toast("留言已提取为 E043");render();}else{state.wrong++;save();toast("密码错误");}}
  function showPhotoPuzzle(){openModal("谜题 08 / 底片恢复",`<h3>恢复 1992 年底片序列</h3><p>调整曝光与对比度，让暗部中的时间标记和人物行为显现。</p><div class="photo-puzzle"><div id="photo-frame" class="photo-frame"></div><div class="puzzle-controls"><label>曝光亮度 <span id="b-val">55</span></label><input id="bright" type="range" min="20" max="100" value="55"><label>对比度 <span id="c-val">100</span></label><input id="contrast" type="range" min="70" max="180" value="100"><p class="file-ref">目标范围<br>亮度 76—84<br>对比度 132—148</p><div class="action-row"><button class="action primary" data-photo-submit>固定显影参数</button></div></div></div>`);bindPhoto();}
  function bindPhoto(){const b=$("#bright"),c=$("#contrast"),f=$("#photo-frame");const up=()=>{const bv=+b.value,cv=+c.value;b.nextElementSibling;c;$("#b-val").textContent=bv;$("#c-val").textContent=cv;f.style.setProperty("--bright",bv/100);f.style.setProperty("--contrast",cv/100);const reveal=Math.max(.08,1-(Math.abs(bv-80)+Math.abs(cv-140)/2)/70);f.style.setProperty("--reveal",reveal)};b.oninput=up;c.oninput=up;up();}
  function solvePhoto(){const b=+$("#bright").value,c=+$("#contrast").value;if(b>=76&&b<=84&&c>=132&&c<=148){state.photo=true;addPuzzle("08");addEvidence(["E057"]);addDeduction("T07");closeModal();toast("底片序列完整恢复");render();}else{toast("影像细节仍不可辨认");}}

  function renderNotes(){root.innerHTML=`<div class="section-intro"><p>私人笔记不会被系统判断，也不会影响结局。内容会和调查档案一起自动保存在本机。</p><span class="tag">AUTOSAVE</span></div><textarea id="notes-area" class="notes-area" placeholder="记录你的疑问、人物关系与尚未解释的矛盾……">${esc(state.notes)}</textarea>`;$("#notes-area").addEventListener("input",e=>{state.notes=e.target.value;save()});}

  const reportQs=[
    {q:"前三名死者为什么被选择？",opts:["与旧案有关","行动规律固定","反对拆迁"],a:1},
    {q:"现案真正目标是谁？",opts:["唐辉","林凯","魏安"],a:1},
    {q:"前三案的作用是什么？",opts:["复仇名单","制造随机连环杀人假象","测试作案手法"],a:1},
    {q:"黑色相纸为什么出现？",opts:["宗教仪式","来自林凯暗房，被复制为共同特征","印刷厂标记"],a:1},
    {q:"公共电话亭为什么重要？",opts:["靠近公交总站","可以匿名","死者都用过"],a:0},
    {q:"第五案为什么发生？",opts:["魏安发现 17 路规律，被临时灭口","计划中的第五人","模仿犯罪"],a:0},
    {q:"1992 年谁纵火？",opts:["黄志远","周成","罗晋川"],a:2},
    {q:"黄志远在火场做什么？",opts:["破坏消防门救人","搬运账本","协助纵火"],a:0},
    {q:"黄启为什么杀林凯？",opts:["误以为照片会证明父亲纵火","林凯勒索他","掩盖公交事故"],a:0},
    {q:"五案凶手是谁？",opts:["周成","赵启明","黄启"],a:2}
  ];
  function renderReport(){if(state.ending){renderEnding();return;}root.innerHTML=`<div class="section-intro"><p>报告将决定案件对外定性。请让每项结论都能解释已入库证物。提交后仍可返回最后存档重试。</p><span class="tag red">FINAL SUBMISSION</span></div><form id="report-form" class="report-form"><div class="card"><label style="display:block;margin-bottom:8px">报告标题</label><select id="report-title"><option>七码头连环杀人案调查报告</option><option>北七码头五起关联杀人案件调查报告</option></select></div>${reportQs.map((x,i)=>`<div class="report-question"><label><span>Q${String(i+1).padStart(2,"0")}</span>${x.q}</label><select name="q${i}" required><option value="">选择结论</option>${x.opts.map((o,j)=>`<option value="${j}">${o}</option>`).join("")}</select></div>`).join("")}<div class="report-question"><label><span>CLASSIFICATION</span>是否存在真正意义上的“连环杀手”？</label><select id="classification"><option value="serial">存在，同一凶手连续作案</option><option value="constructed">不存在，这是为隐藏单一目标制造的犯罪叙事</option></select></div><div class="action-row"><button class="action primary" type="submit">签署并提交报告</button></div></form>`;}
  function submitReport(form){const data=new FormData(form);const raw=reportQs.map((_,i)=>data.get(`q${i}`));if(raw.some(v=>v===""||v===null)){toast("报告仍有未完成项目");return;}const vals=raw.map(Number);const score=vals.filter((v,i)=>v===reportQs[i].a).length;const suspect=vals[9];const hidden=$("#classification").value==="constructed"||$("#report-title").selectedIndex===1;
    let type;if(suspect===0)type="C";else if(!state.sunSafe)type="D";else if(score===10&&state.photo&&hidden&&state.wrong<=2&&["E047","E048","E049","E050","E051","E052","E053","E054","E055","E056","E057","E059","E060"].every(has))type="E";else if(score===10&&state.photo)type="A";else if(suspect===2&&score>=7)type="B";else type="C";state.ending={type,score};addPuzzle("15");save();renderEnding();}
  function renderEnding(){const endings={
    A:{kind:"真结局",title:"照片上的人",text:"黄启认罪。1992 年北七印刷厂火灾重新立案，罗晋川纵火、赵启明与周成掩盖证据的事实被公开。黄志远的档案终于从“失踪嫌疑人”改为“遇难救援者”。",quote:"所以我杀的那个人……原本是唯一想替他证明清白的人。"},
    B:{kind:"普通结局",title:"七码头杀手",text:"黄启因五起命案被捕，媒体宣布“七码头连环杀手案”告破。没有完整照片，十二年前的真相仍被埋在烧毁的厂房里。",quote:"抓到凶手并不等于理解案件。"},
    C:{kind:"错误结局",title:"错误的人",text:"周成被暂时拘留。二十四小时后，真正的凶手消失，街区另一面墙上出现了数字 6。你的证据解释不了你写下的名字。",quote:"证据不足时，结论只是另一种先入为主。"},
    D:{kind:"黑暗结局",title:"第六个数字",text:"黄启最终被捕，但孙倩没能从公交总站回来。墙上的数字从五变成六，一个本来可以被阻止的意外成为了新的案卷。",quote:"当一个谎言需要新的死亡维持时，它已经不再需要理由。"},
    E:{kind:"隐藏结局",title:"没有连环杀手",text:"报告拒绝沿用媒体创造的标题。唐辉、吴峰、方蓉并非因共同身份死亡；林凯才是犯罪中心。五起命案被重新定义，黄志远恢复名誉，所有参与掩盖旧案的人接受调查。",quote:"证据本身不会说话。人会选择怎样理解它。"}
  };const e=endings[state.ending.type];root.innerHTML=`<div class="ending"><span class="ending-type">${e.kind} / REPORT SCORE ${state.ending.score}/10</span><h3>《${e.title}》</h3><p>${e.text}</p><blockquote>${e.quote}</blockquote><p class="file-ref">CASE LC-04-1207 // CLOSED</p><div class="ending-actions"><button class="action" data-retry-report>修改报告</button><button class="action primary" data-back-title>返回标题</button></div></div>`;updateChrome();}

  function protectSun(){if(state.sunSafe){toast("孙倩已进入保护程序");return;}state.sunSafe=true;action();save();toast("已安排警员保护孙倩");render();}

  document.addEventListener("click",e=>{
    const nav=e.target.closest("[data-view],[data-nav]");if(nav){navigate(nav.dataset.view||nav.dataset.nav);return;}
    if(e.target.closest("[data-desk='intake']")){intake();return;}if(e.target.closest("[data-desk='advance']")){advance();return;}
    const loc=e.target.closest("[data-loc]");if(loc){renderLocation(loc.dataset.loc);return;}if(e.target.closest("[data-back-map]")){activeLocation=null;navigate("map");return;}
    const sp=e.target.closest("[data-spot]");if(sp){inspectSpot(+sp.dataset.spot);return;}
    const per=e.target.closest("[data-person]");if(per){interview(per.dataset.person);return;}
    const ev=e.target.closest("[data-evidence]");if(ev){selectEvidence(ev.dataset.evidence);return;}
    if(e.target.closest("[data-clear-selection]")){state.selected=[];renderEvidence();return;}if(e.target.closest("[data-combine]")){combine();return;}
    const pu=e.target.closest("[data-puzzle]");if(pu){startPuzzle(pu.dataset.puzzle);return;}const ans=e.target.closest("[data-answer]");if(ans){const [p,c]=ans.dataset.answer.split(":");answerPuzzle(p,c);return;}
    if(e.target.closest("[data-phone-submit]")){solvePhone();return;}if(e.target.closest("[data-photo-submit]")){solvePhoto();return;}if(e.target.closest("[data-check-timeline]")){checkTimeline();return;}
    if(e.target.closest("[data-protect-sun]")){protectSun();return;}if(e.target.closest("[data-retry-report]")){state.ending=null;save();renderReport();return;}if(e.target.closest("[data-back-title]")){shell.hidden=true;titleScreen.hidden=false;$("#continue-game").hidden=false;return;}
  });
  $("#modal-close").addEventListener("click",closeModal);modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
  $("#new-game").addEventListener("click",()=>{state=freshState();save();titleScreen.hidden=true;shell.hidden=false;navigate("desk")});
  $("#continue-game").addEventListener("click",()=>{load();titleScreen.hidden=true;shell.hidden=false;navigate("desk")});
  $("#save-game").addEventListener("click",()=>save(false));
  $("#reset-game").addEventListener("click",()=>{if(confirm("确定清除本机调查档案？此操作无法撤销。")){localStorage.removeItem(SAVE_KEY);state=freshState();shell.hidden=true;titleScreen.hidden=false;$("#continue-game").hidden=true;}});
  document.addEventListener("submit",e=>{if(e.target.id==="report-form"){e.preventDefault();submitReport(e.target);}});
  setInterval(()=>{$("#system-clock").textContent=new Date().toLocaleTimeString("zh-CN",{hour12:false})},1000);
  if(localStorage.getItem(SAVE_KEY))$("#continue-game").hidden=false;

  // Contextual fifth-chapter safety action appears on desk/task flow.
  const originalDesk=renderDesk;renderDesk=function(){originalDesk();if(state.chapter===5&&!state.sunSafe){root.insertAdjacentHTML("beforeend",`<div class="callout" style="margin-top:16px"><b>风险通报：</b>孙倩准备独自前往公交总站。<div class="action-row"><button class="action red" data-protect-sun>建议警方保护（+1 行动）</button></div></div>`);}};
})();
