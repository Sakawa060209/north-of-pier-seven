/* 第七码头以北 — standalone static investigation game */
(() => {
  "use strict";
  const SAVE_KEY = "north-of-pier-seven-save-v1";

  const chapters = [
    {n:1,title:"数字 1",date:"2004 / 11 / 19",intro:"唐辉死在电影院后巷。墙上的数字、垃圾桶旁的黑色相纸，以及一通来自公共电话亭的电话，让一个普通夜晚有了被设计过的形状。",dispatch:"先从唐辉的死亡时间与固定路线入手。现场的每一件东西都可能只是垃圾。",objectives:["领取第一案卷宗","调查电影院后巷","调查唐辉酒吧","判断唐辉为何经过后巷"]},
    {n:2,title:"黑色相纸",date:"2004 / 12 / 03",intro:"第二名死者出现在地下排水道，第三名死者倒在废弃旅馆。数字增加，死法改变，媒体已经替你写好了结论：连环杀手。",dispatch:"重新比较三人的生活记录。身份标签也许并不是凶手选择他们的依据。",objectives:["调查第二案现场","调查第三案现场","取得三名死者日程","完成“共同点”推理"]},
    {n:3,title:"第四个人",date:"2004 / 12 / 10",intro:"摄影师林凯成为数字 4。他的相机缺了一卷胶片，外套里有一个写着“92 / 12 / 18 / 北七”的空盒。",dispatch:"查明现场相纸的来源，再解释凶手为何只取走相机里的胶卷。",objectives:["勘查河滨仓库","搜查林凯摄影室","确认相纸来源","解释第四案的异常"]},
    {n:4,title:"十二年前",date:"2004 / 12 / 11",archiveDate:"1992 / 12 / 18",intro:"北七印刷厂火灾，死亡四人、失踪一人。缺失的第 47 页、无法解释的消防门记录和一卷损坏底片，让事故结论开始出现裂缝。",dispatch:"当前仍是 2004 年。先核查官方事故报告中的技术矛盾；缺页原因必须经过装订鉴定。",objectives:["调阅 1992 年旧档","发现事故报告的技术矛盾","证明旧案报告遭人为篡改","确认系统性掩盖","恢复完整底片序列"]},
    {n:5,title:"多出来的第五人",date:"2004 / 12 / 12",intro:"记者魏安死于车辆撞击。现场同样出现数字与黑色相纸，但细节需要与前四案逐项核对。",dispatch:"魏安留下三个词：17 / 返回 / 电话。先确认它们指向什么。孙倩的保护申请是限时可选行动。",objectives:["调查第五案路口","破解魏安答录机","检查公交总站维修车","完成五案异常对比","⚠ 申请保护孙倩（可选）"]},
    {n:6,title:"第七码头以北",date:"2004 / 12 / 13",intro:"魏安留下的三个词仍未被完整解释：17 / 返回 / 电话。四份尸检、电话记录与车辆登记也许能还原凶手的机会窗口。",dispatch:"先分析线路覆盖，再独立核对四案时间。两个结论必须分别成立。",objectives:["判断哪条线路具有观察条件","重建四案时间窗口","确认黄启与黄志远关系","完成最终报告"]}
  ];

  const evRows = `
E001|唐辉尸检报告|A|警局|死亡时间 23:26—23:34。与末班车交接时间存在重叠窗口。|5
E002|墙上的数字 1|B|电影院后巷|白色粉笔书写。笔画平稳，没有可辨识的符号学含义。|4
E003|黑色相纸 A|A|电影院后巷|完全曝光的旧式相纸，边缘批号被裁去。|4
E004|公交票残片|A|电影院后巷|排水沟内的残票，只剩蓝灰底纹、两位模糊线路码和半枚检票孔。需与公交票样本进行比对。|4
E005|唐辉工作与门禁记录|B|唐辉酒吧|每周五 23:20 左右关店；11/19 后门磁卡记录显示他于 23:24 离开。|5
E006|唐辉债务记录|C|唐辉酒吧|死者欠有私人债务，但债主在案发时有明确行踪。|3
E007|后巷鞋印|B|电影院后巷|约 42 码防滑工作鞋，无法对应唯一职业。|3
E008|电话记录 1|A|唐辉酒吧|23:21 接到公共电话亭来电，随后唐辉离店。|5
E009|吴峰尸检报告|A|警局|死亡时间约 22:12，死因为溺水。|5
E010|通道内数字 2|B|地下排水道|红色油性笔书写，与第一案媒介不同。|4
E011|黑色相纸 B|A|地下排水道|纸张型号与 E003 相同。|4
E012|维修工具箱与入口记录|B|地下排水道|工具完整；入口巡检卡记录吴峰于 22:03 签到进入通道。|4
E013|维修地址纸条|A|地下排水道|吴峰口袋里写着“北七巷 17-4”。纸张来自便民电话旁的留言簿，地址尚未核查。|5
E014|电话记录 2|A|吴峰住所|21:54 接到同一公共电话亭来电。|5
E015|地下鞋印|B|地下排水道|工作鞋纹路与后巷相近，但不是唯一型号。|3
E016|赵氏地产施工图|C|吴峰曾参与北七巷拆迁管线工程，图纸上留有他与赵氏地产工程部的往来批注。|3
E017|方蓉尸检报告|A|警局|死亡时间约 21:05，死因为窒息。|5
E018|旅馆墙面数字 3|B|海鸥旅馆|喷漆书写，媒介再次改变。|4
E019|黑色相纸 C|A|海鸥旅馆|批次、切口与前两案相纸吻合。|4
E020|猫粮袋|A|海鸥旅馆|方蓉每周在同一家店固定购买。|4
E021|方蓉日记与门卫记录|A|方蓉住所|每周三、周五晚独自前往旅馆喂猫；12/03 门卫登记她于 20:52 离开。|5
E022|反拆迁徽章|C|海鸥旅馆|印有“保留北七旧街区”，背针有近期佩戴留下的纤维。|2
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
E035|赵启明名片|C|摄影工作室|背面有林凯手写的“出价三次，不交原片”。|3
E036|河滨争吵证词|B|河滨仓库|居民于 22:37 看见林凯抵达，并听到两名相互认识的男性争执底片。|3
E037|魏安尸检报告|A|警局|车辆撞击死亡，作案方式与前四案明显不同。|5
E038|路口数字 5|A|电话亭路口|白色涂料书写，笔画倾斜并有重复描画；需与前四案数字样本比对。|5
E039|相纸碎片|A|电话亭路口|边缘不规则、尺寸小于前四案相纸；是否属于同一布置方式尚待分析。|5
E040|车辆油漆碎片|A|电话亭路口|灰蓝色多层旧漆，夹有维修车辆常见的防锈底漆；尚未匹配具体车辆。|5
E041|魏安记者证|B|电话亭路口|死者正在追查电话记录与公交系统。|4
E042|魏安笔记|A|报社|写有“17 / 返回 / 电话”。|5
E043|魏安录音留言|A|报社|“关键不是电话，是回总站的路。”|5
E044|维修车出入记录|A|公交总站|19:31—20:03 之间记录缺失。|5
E045|三辆维修车轮胎拓片|A|公交总站|A、B、C 三车的胎纹拓片与轴距数据。需和路口压痕逐项比对。|5
E046|1992 火灾报道|B|二手书店|官方将北七印刷厂火灾归因于电路老化。|3
E047|原始死亡名单|A|警局旧档|黄志远被列为“失踪”，遗体从未准确辨认。|5
E048|卷宗装订异常|A|警局旧档|目录从 46 直接跳到 48；装订线附近有断裂纸纤维，第 47 页缺失，原因待鉴定。|5
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
E061|临川北部公交线路册|A|公交总站|包含 12、17、23、31 路站点、折返路线与各站步行距离，尚未标注与案发地点的关系。|5
E062|黄启排班表|A|公交总站|前四案黄启全部值晚班。|5
E063|车辆回站登记簿|A|公交总站|11/19 23:18、11/26 21:51、12/03 20:46、12/10 22:21，均由黄启签字完成交接。|5
E064|制服领用记录|B|公交总站|黄启领用深蓝冬季制服，吻合第三案目击。|4
E065|工作鞋型号|B|公交总站|防滑纹路吻合现场，但该型号并非黄启独有。|3
E066|电话亭步行图|A|公共电话亭|电话亭距北七码头公交总站约 3 分钟步行；图上未注明具体线路。|5
E067|维修钥匙表|A|公交总站|黄启拥有取得第五案维修车钥匙的权限。|5
E068|换班异常记录|A|公交总站|第四案当晚黄启多出约 14 分钟无记录空档。|5
E069|许文调查笔记|B|二手书店|许文多年追查旧案，并把赵启明列为火灾与现案的首要关联人。|3
E070|陈岚旧合照|B|社区诊所|陈岚与火灾幸存者家庭的联系。|4
E071|林雪旧照片|B|老电影院|赵启明年轻时频繁出入印刷厂。|4
E072|孙倩调查表|A|报社|林凯与魏安曾共享资料，孙倩是下一名潜在知情人。|5
E073|黄启父子照片|A|公交总站|照片背面写有“黄启与父亲黄志远，1991”。|5
E074|周成旧警员证|B|周成警务室|证明周成 1992 年已经参与火灾现场记录。|4
E075|赵氏地产名单|C|赵氏地产|唐辉、吴峰、方蓉的姓名都曾出现在不同年份的拆迁联络或施工往来记录中。|2`;

  const evidence = Object.fromEntries(evRows.trim().split("\n").map(row => {
    const [id,name,grade,source,desc,stars] = row.split("|");
    return [id,{id,name,grade,source,desc,stars:+stars}];
  }));

  const findings = {
    F01:{name:"票样比对：17 路",desc:"残片的蓝灰底纹、线路码右半部与检票孔位置只吻合 17 路旧票样。"},
    F02:{name:"地址核查：门牌不存在",desc:"旧门牌簿中北七巷 17 号之后直接是 19 号；17-4 从未登记。"},
    F03:{name:"装订鉴定：人为拆页",desc:"断口纤维受力方向一致，缺页并非自然脱落，而是沿装订线主动撕除。"},
    F04:{name:"款项流向：周成关联账户",desc:"ZC-92-12 经中间账户进入周成哥哥经营的商店。"},
    F05:{name:"车辆匹配：维修 B 车",desc:"路口胎纹、轴距与油漆层次均只吻合维修 B 车。"},
    F06:{name:"第五案模式断裂",desc:"日期、事前来电、相纸形态、数字笔迹与预置痕迹五项偏离前四案；距离、编号与死法差异仍延续旧模式。"},
    F07:{name:"照片序列观察记录",desc:"起火前罗晋川携油桶离开；起火后黄志远从内部破坏消防门并协助工人逃生。"}
  };

  const people = [
    {id:"chen",ch:1,name:"陈岚",age:34,job:"社区诊所医生",initial:"岚",suspicion:42,bio:"社区医生。第一案当晚曾经过电影院后巷。",truth:"知道火灾并非普通事故，但不知道纵火者身份。",rounds:["我只是恰好经过后巷。过去的事和唐辉没有关系。","那场火不是电路问题。我母亲从消防门逃了出来，有人从里面砸开了门。","黄志远不是凶手。没有他，我母亲活不到今天。"]},
    {id:"zhou",ch:1,name:"周成",age:47,job:"社区警务室警察",initial:"周",suspicion:82,bio:"专案组联络警员，熟悉北七码头街区。",truth:"修改并销毁过旧案材料，但不是现案凶手。",rounds:["我很多年没去过印刷厂了。","我只是路过旧址。档案缺页也许是保管不当。","报告是我改的。赵启明给了钱。我有罪，但那五个人不是我杀的。"]},
    {id:"xu",ch:3,name:"许文",age:31,job:"二手书店老板",initial:"许",suspicion:36,bio:"火灾遇难者家属，多年收集北七旧案资料。",truth:"重要信息源。他锁定赵启明的判断解释了账本，却不能独立解释现案。",rounds:["我父亲不是死于事故。有人让所有人闭嘴。","林凯来过，他把一张裁切的接触样片留给我保管。","完整照片不在我这里。但林凯说过：只看一张，会把救人者当成凶手。"]},
    {id:"sun",ch:5,name:"孙倩",age:26,job:"《临川晚报》记者",initial:"倩",suspicion:12,bio:"魏安同事，正在继续追查其未完成的调查。",truth:"掌握魏安留言与记者共享资料，可在最终行动中存活或成为第六名受害者。",rounds:["魏安说电话亭只是表面，他把数字 17 圈了三次。","林凯、魏安和我共享一份资料。林凯准备公开 1992 年照片。","我可以把底片交给你，但我要看着它进入证物袋。"]},
    {id:"zhao",ch:2,name:"赵启明",age:61,job:"地产开发商",initial:"赵",suspicion:76,bio:"推动街区拆迁，数名死者曾与其项目发生松散联系。",truth:"参与掩盖旧案、长期收买知情者，但不是现案凶手。",rounds:["拆迁有争议不等于杀人。林凯的照片，我只是想买下来。","罗晋川说只烧账本。我没想到火会失控。","钱是我付的，周成改了报告。黄志远不是我们的人。"]},
    {id:"huang",ch:2,name:"黄启",age:38,job:"临川公交司机",initial:"启",suspicion:18,bio:"夜班公交司机，当前身份为普通目击证人。",truth:"黄志远之子，也是五案真凶。因误读裁切照片而杀害唯一能证明父亲清白的人。",rounds:["开久了，谁几点上车、几点回家，我大概都知道。但我不认识死者。","排班不是我定的。总站附近那么多人……我不认识林凯。","我只看到他进仓。他们会再说我爸纵火。我不能让那卷照片出去。"]},
    {id:"lin",ch:4,name:"林雪",age:59,job:"老电影院管理员",initial:"雪",suspicion:31,bio:"老电影院管理员，保管着一批未移交的旧档案。",truth:"见到过罗晋川车辆，地下室保存着林正国遗留档案。",rounds:["十二年前的事，记得太清楚不一定是好事。","那晚我看见一辆车，但我不能确定是谁。","是罗晋川的车。赵启明求我别说，我把证词藏在地下室。"]}
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
      {n:"工作台",x:25,y:38,ids:["E031","E034"]},{n:"暗房垃圾",x:72,y:68,ids:["E033"]},{n:"文件抽屉",x:57,y:26,ids:["E035"]},{n:"墙柜暗格",x:84,y:43,ids:["E057"]},{n:"暗房水槽",x:38,y:72,ids:[],obs:"水槽里的显影液已经干成一圈银灰色水线。墙上夹着四张没有人物的城市街景，取景位置都在公交站牌对面。"}]},
    {id:"bookstore",name:"二手书店",ch:3,x:36,y:35,theme:"archive",desc:"许文把十二年的报纸、照片和猜测塞满了整个后屋。",spots:[
      {n:"防潮照片袋",x:33,y:57,ids:["E032"]},{n:"旧报纸架",x:68,y:38,ids:["E046","E058"]},{n:"调查笔记",x:78,y:73,ids:["E069"]}]},
    {id:"printworks",name:"北七印刷厂旧址",ch:4,x:60,y:61,theme:"print",desc:"烧毁的厂房即将拆除，机械消防门的残骸还留在墙里。",spots:[
      {n:"消防门",x:18,y:42,ids:["E049","E060"]},{n:"办公室废墟",x:63,y:68,ids:["E052","E054"]},{n:"装订室",x:82,y:31,ids:[],obs:"烧弯的装订针散在地上。靠墙还留着一把儿童用的木尺，背面写着某个工人的孩子姓名。"}]},
    {id:"basement",name:"电影院地下室",ch:4,x:27,y:16,theme:"archive",desc:"林雪保存了摄影记者林正国未被收走的资料。",spots:[
      {n:"旧照片箱",x:28,y:56,ids:["E050"]},{n:"记者文件袋",x:72,y:37,ids:["E051","E056"]},{n:"私人相册",x:80,y:74,ids:["E071"]}]},
    {id:"clinic",name:"社区诊所",ch:4,x:10,y:55,theme:"archive",desc:"陈岚拒绝谈自己，却保存着母亲的烧伤随访记录。",spots:[
      {n:"病历柜",x:34,y:40,ids:["E055"]},{n:"旧合照",x:70,y:63,ids:["E070"]}]},
    {id:"news",name:"《临川晚报》报社",ch:5,x:44,y:18,theme:"archive",desc:"魏安的桌面停在他离开时的样子，答录机等待四位密码。",spots:[
      {n:"魏安笔记本",x:25,y:62,ids:["E042"]},{n:"答录机",x:62,y:45,ids:[]},{n:"共享资料表",x:81,y:68,ids:["E072"]}]},
    {id:"booth",name:"公共电话亭路口",ch:1,x:70,y:47,theme:"booth",desc:"街区北侧的老式便民电话。它与其他地点的步行关系尚未核查。",spots:[
      {n:"电话机",x:30,y:38,ids:["E066"]},{n:"第五案现场",x:70,y:72,ids:["E038","E039","E040","E041"]}]},
    {id:"bus",name:"北七码头公交总站",ch:5,x:84,y:49,theme:"bus",desc:"车辆、排班与整座街区的夜间节奏在这里汇合。",spots:[
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
    {id:"T04A",name:"相纸来自林凯暗房",need:["E027","E033"],desc:"四案相纸与林凯暗房垃圾属于同一批次。"},
    {id:"T04B",name:"林凯是真正目标",need:["E028","E029"],needsD:["T04A"],desc:"凶手寻找底片，并把目标自身特征复制给前三案。"},
    {id:"T05",name:"第五案不在原计划",need:["E038","E039","E043"],desc:"临时灭口被仓促伪装成第五起连环案件。"},
    {id:"T06",name:"公共电话共同来源",need:["E008","E014","E024","E030"],desc:"电话是行动便利，不是仪式。"},
    {id:"T07",name:"不完整信息造成误会",need:["E032","E057"],desc:"黄启只看到了父亲入仓的第一张照片。"},
    {id:"T08A",name:"事故报告存在技术矛盾",need:["E049","E060"],desc:"机械消防门不会因停电失效。"},
    {id:"T08B",name:"旧案报告遭人为篡改",need:["E050","E059"],needsD:["T08A"],needsF:["F03"],desc:"装订鉴定、损坏方向与被删记录证明报告被人为改写。"},
    {id:"T08C",name:"旧案存在系统性掩盖",need:["E052","E053"],needsD:["T08B"],needsF:["F04"],desc:"非法账本、付款流向鉴定与报告篡改形成完整掩盖链。"},
    {id:"T09A",name:"线路观察条件",need:["E005","E021","E061"],needsF:["F01"],desc:"一条公交线路可以长期覆盖三名受害者的固定活动区域。"},
    {id:"T09B",name:"四案机会窗口",need:["E001","E009","E017","E025","E063"],needsD:["T09A"],desc:"同一名晚班司机在前四案中均有足够的无记录时间。"},
    {id:"T10",name:"黄志远破门救人",need:["E050","E055"],desc:"破坏方向与幸存者证词相互印证。"}
  ];

  function freshState(){return {chapter:1,evidence:[],evidenceLog:{},findings:[],deductions:[],visited:[],spots:[],puzzles:[],interviews:{},huangConfrontation:0,selected:[],notes:"",pressure:0,pressureEvents:[],wrong:0,sunSafe:false,sunOutcome:"pending",sunDeadline:null,timeline:false,photo:false,ending:null,actions:0,wastedActions:0,gameMinutes:1180,destroyedE059:false,intake:[]};}
  let state = freshState();
  let activeView = "desk", activeLocation = null;

  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const titleScreen = $("#title-screen"), shell = $("#game-shell"), root = $("#view-root"), modal = $("#modal"), modalBody = $("#modal-body");
  const has = id => state.evidence.includes(id), hasF=id=>state.findings.includes(id), hasD = id => state.deductions.includes(id), spotKey = (l,i) => `${l}:${i}`;
  const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  function save(silent=true){localStorage.setItem(SAVE_KEY,JSON.stringify(state)); if(!silent) toast("调查档案已写入本地存储");}
  function load(){try{const parsed=JSON.parse(localStorage.getItem(SAVE_KEY));if(parsed){state={...freshState(),...parsed};state.evidenceLog={...(parsed.evidenceLog||{})};state.findings=[...(parsed.findings||[])];state.intake=[...(parsed.intake||[])];if(state.deductions.includes("T04")&&!hasD("T04A"))state.deductions.push("T04A");if(state.deductions.includes("T08")&&!hasD("T08B"))state.deductions.push("T08A","T08B");if(state.deductions.includes("T09")&&!hasD("T09A"))state.deductions.push("T09A");}}catch{} }
  function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2200);$("#ticker-text").textContent=msg;}
  function openModal(label,html){openModal.returnFocus=document.activeElement;modal.classList.remove("modal-wide");$("#modal-label").textContent=label;modalBody.innerHTML=html;modal.showModal();setTimeout(()=>(modalBody.querySelector("[data-autofocus]")||modalBody.querySelector("button,input,select"))?.focus(),0);}
  function closeModal(){modal.close();if(openModal.returnFocus?.isConnected)openModal.returnFocus.focus();}
  function gameTime(){const h=Math.floor(state.gameMinutes/60)%24,m=state.gameMinutes%60;return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;}
  function addEvidence(ids, message=true, force=false){const added=[];ids.forEach(id=>{if(id==="E059"&&state.destroyedE059&&!force)return;if(evidence[id]&&!has(id)){state.evidence.push(id);state.evidenceLog[id]={chapter:state.chapter,time:gameTime()};added.push(id);}});if(added.length&&message)toast(`证物入库：${added.join(" / ")}`);save();updateChrome();return added;}
  function addDeduction(id){if(!hasD(id)){state.deductions.push(id);toast(`形成新推论：${deductions.find(x=>x.id===id)?.name||id}`);save();updateChrome();}}
  function addFinding(id){if(findings[id]&&!hasF(id)){state.findings.push(id);toast(`鉴定记录完成：${findings[id].name}`);save();updateChrome();}}
  function addPuzzle(id){if(!state.puzzles.includes(id)){state.puzzles.push(id);save();}}
  function addMinutes(time,delta){const [h,m]=time.split(":").map(Number),total=(h*60+m+delta+1440)%1440;return `${String(Math.floor(total/60)).padStart(2,"0")}:${String(total%60).padStart(2,"0")}`;}
  function action({cost=1,minutes=18,pressure=0,waste=false}={}){state.actions+=cost;state.gameMinutes+=minutes;state.pressure=Math.min(40,state.pressure+pressure);if(waste)state.wastedActions+=cost;checkPressure();if(state.chapter===5&&state.sunOutcome==="pending"&&state.sunDeadline!==null&&state.actions>=state.sunDeadline){state.sunOutcome=state.pressure>=8?"dead":"injured";toast(state.sunOutcome==="dead"?"紧急通报：孙倩在总站失联":"紧急通报：孙倩独自调查时受伤");}save();if(!shell.hidden)updateChrome();}
  function checkPressure(){const events=[
    {at:4,id:"media",text:"媒体正式使用“七码头连环杀手”称呼，调查压力上升。"},
    {at:7,id:"superior",text:"上级要求提交初步嫌疑方向，错误指认的代价将提高。"},
    {at:8,id:"sun",text:"孙倩决定独自前往公交总站；第五章保护窗口将十分有限。"},
    {at:10,id:"destroy",text:"周成开始清理旧档。若原始修改报告尚未入库，只能通过审讯恢复。"},
    {at:12,id:"force",text:"专案组达到最高压力：第六章将被要求尽快结案。"}
  ];events.forEach(ev=>{if(state.pressure>=ev.at&&!state.pressureEvents.includes(ev.id)){state.pressureEvents.push(ev.id);if(ev.id==="destroy"&&!has("E059"))state.destroyedE059=true;toast(ev.text);}});}

  function progress(){return Math.min(99,Math.round((state.chapter-1)*16.5 + state.evidence.length*.28 + state.deductions.length*1.3 + state.puzzles.length*.6));}
  function trust(){const score=state.evidence.filter(id=>["A","A+"].includes(evidence[id]?.grade)).length+state.deductions.length*2-state.wrong*2;return score>35?"高":score>15?"中":"低";}
  function objectiveDone(i){const c=state.chapter;const checks={
    1:[has("E001"),has("E002")&&has("E003"),has("E005")&&has("E008"),hasD("T01")],
    2:[has("E009")&&has("E013"),has("E017")&&has("E019"),has("E005")&&has("E021"),hasD("T03")],
    3:[has("E025")&&has("E029"),has("E031")&&has("E033"),hasD("T04A"),hasD("T04B")],
    4:[has("E047")&&has("E048"),hasD("T08A"),hasD("T08B"),hasD("T08C"),state.photo],
    5:[has("E038")&&has("E040"),has("E043"),has("E044")&&has("E045"),hasD("T05"),state.sunSafe],
    6:[hasD("T09A"),hasD("T09B")&&state.timeline,has("E073"),!!state.ending]
  };return checks[c][i];}
  function canAdvance(){const count=chapters[state.chapter-1].objectives.length-(state.chapter===5?1:0);return Array.from({length:count},(_,i)=>objectiveDone(i)).every(Boolean);}
  function updateChrome(){
    const ch=chapters[state.chapter-1];$("#game-date").textContent=ch.date;$("#system-clock").textContent=gameTime();$("#metric-progress").textContent=progress()+"%";$("#metric-trust").textContent=trust();$("#metric-pressure").textContent=state.pressure;$("#evidence-count").textContent=state.evidence.length;$("#chapter-chip").innerHTML=`第${["一","二","三","四","五","六"][state.chapter-1]}章 / ${ch.title}${ch.archiveDate?`<span class="archive-date">ARCHIVE ${ch.archiveDate}</span>`:""}`;$("#dispatch-text").textContent=ch.dispatch;
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
      <div class="desk-row"><section class="card"><span class="file-ref">VICTIM INDEX / VERIFIED</span><h3>五名死者</h3><div class="case-list">${victims.map((v,i)=>{const unlock=[1,2,2,3,5][i],shown=state.chapter>=unlock;return `<div class="case-row" style="opacity:${shown?.98:.2}"><span class="num">${i+1}</span><div><b>${v.split(" · ")[0]}</b><small>${v.split(" · ").slice(1).join(" / ")}</small></div><em>${shown?"已建档":"封存"}</em></div>`}).join("")}</div></section>
      <section><div class="card"><span class="file-ref">CHAPTER CONTROL</span><h3>阶段核查</h3><p>${canAdvance()?"本章必要调查已完成。可以推进案情。":"完成右侧列出的调查目标。错误方向不会阻止调查，但会影响最终评级。"}</p><div class="action-row"><button class="action" data-desk="intake" ${state.intake.includes(state.chapter)?"disabled":""}>${state.intake.includes(state.chapter)?"✓ 当前案卷已领取":"领取当前案卷"}</button>${state.chapter<6?`<button class="action primary" data-desk="advance" ${canAdvance()?"":"disabled"}>结束本章</button>`:`<button class="action primary" data-nav="report">提交案件报告</button>`}</div></div>
      <div class="card" style="margin-top:15px"><span class="file-ref">ACTIVE THEORY</span><h3>${hasD("T04B")?"连环案可能是伪装":hasD("T04A")?"相纸来源已确认":hasD("T03")?"受害者因可预测而被选中":"共同模式尚未解释"}</h3><p>${hasD("T04B")?"真正目标被隐藏在三个随机死者之中。":hasD("T04A")?"来源相同不等于犯罪结构已经解释，还要判断凶手为何寻找底片。":hasD("T03")?"共同点未必属于死者，也可能属于观察他们的人。":"不要急着给数字和相纸赋予意义。"}</p></div></section></div>${state.chapter===4?chapter4Recap():""}${state.pressureEvents.length?`<div style="margin-top:15px">${state.pressureEvents.map(id=>{const m={media:"媒体已命名本案，证人开始受报道影响。",superior:"上级要求初步嫌疑方向，错误指认将增加更多压力。",sun:"孙倩已经准备独自调查，保护窗口将在第五章开启。",destroy:"周成已经清理部分旧档，缺失报告需从口供恢复。",force:"专案组已达到最高压力，第六章将被要求尽快结案。"};return `<div class="pressure-event">${m[id]}</div>`}).join("")}</div>`:""}`;
  }
  function chapter4Phase(){if(hasD("T08C"))return 3;if(hasF("F03")&&hasD("T08A"))return 2;return 1;}
  function chapter4Recap(){const p=chapter4Phase(),copy={1:["阶段一 / 核查事故结论","先检查缺页装订与消防门结构。此时不要预设报告被谁修改。"],2:["阶段二 / 追查报告去向","技术矛盾已经成立。周成开始明显紧张，赵启明主动致电询问调查进度。新的旧案地点已经开放。"],3:["阶段三 / 恢复目击序列","掩盖链已经闭合。回到林凯暗房，恢复那卷被损坏的底片。"]}[p];return `<div class="callout chapter-recap"><span class="file-ref">1992 REOPENED / ${p} OF 3</span><h3>${copy[0]}</h3><p>${copy[1]}</p></div>`;}
  function intake(){if(state.intake.includes(state.chapter)){toast("当前章节案卷已经领取");return;}const packs={1:["E001"],2:["E009","E017"],3:["E025"],4:["E047"],5:["E037"],6:["E061"]};const added=addEvidence(packs[state.chapter]);state.intake.push(state.chapter);if(added.length)action({minutes:5});save();render();}
  function advance(){if(!canAdvance())return;if(state.chapter===5&&state.sunOutcome==="pending")state.sunOutcome=state.pressure>=8?"dead":"injured";if(state.chapter<6){state.chapter++;const starts={2:1270,3:1230,4:1175,5:1100,6:1160};state.gameMinutes=starts[state.chapter];if(state.chapter===5)state.sunDeadline=state.actions+3;save();toast(`新章节解锁：${chapters[state.chapter-1].title}`);navigate("desk");}}

  function locationAvailable(l){if(l.ch>state.chapter)return false;if(state.chapter===4&&chapter4Phase()===1&&["basement","clinic"].includes(l.id))return false;return true;}
  function locationName(l){return l.id==="bus"&&hasD("T09A")?"17 路公交总站":l.name;}
  function evidenceAvailable(id){if(evidenceChapter(id)>state.chapter)return false;if(state.chapter===4){const n=+id.slice(1),phase=chapter4Phase();if(id==="E057")return phase>=3;if(n>=50&&n<=59)return phase>=2;}return true;}
  function locationHasNew(l){if(!state.visited.includes(l.id))return false;const unlocked=l.spots.some(s=>s.ids.some(id=>evidenceAvailable(id)&&id!=="E057"&&!has(id)&&!(id==="E059"&&state.destroyedE059)));return unlocked||(l.id==="studio"&&state.chapter>=4&&chapter4Phase()>=3&&!state.photo)||(l.id==="news"&&state.chapter>=5&&!has("E043"));}
  function spotHasNew(l,s){return s.ids.some(id=>evidenceAvailable(id)&&id!=="E057"&&!has(id)&&!(id==="E059"&&state.destroyedE059))||(l.id==="studio"&&s.n==="墙柜暗格"&&state.chapter>=4&&chapter4Phase()>=3&&!state.photo)||(l.id==="news"&&s.n==="答录机"&&!has("E043"));}
  function renderMap(){const visible=locations.filter(locationAvailable);root.innerHTML=`<div class="section-intro"><p>地图只显示当前档案已确认的地点。○ 为未调查，✓ 为已调查，红色 ! 表示旧地点出现了新的调查方向。</p><span class="tag">已访问 ${state.visited.filter(id=>visible.some(l=>l.id===id)).length} / ${visible.length}</span></div><div class="map-board">${visible.map(l=>{const i=locations.indexOf(l),fresh=locationHasNew(l);return `<button class="map-node ${state.visited.includes(l.id)?"visited":""} ${fresh?"new":""}" data-loc="${l.id}" style="left:${Math.min(l.x,82)}%;top:${Math.min(l.y,88)}%">${fresh?"!":state.visited.includes(l.id)?"✓":"○"} ${String(i+1).padStart(2,"0")} ${locationName(l)}</button>`}).join("")}</div>`;}
  function renderLocation(id){const l=locations.find(x=>x.id===id);if(!l||!locationAvailable(l)){activeLocation=null;navigate("map");return;}activeLocation=id;if(!state.visited.includes(id)){state.visited.push(id);action({minutes:18});save();}const displayName=locationName(l);
    root.innerHTML=`<button class="back-link" data-back-map>← 返回城区地图</button><div class="scene"><div class="scene-canvas" data-theme="${l.theme}"><span class="scene-label">SCENE ${l.id.toUpperCase()} / ${displayName}</span><div class="scene-silhouette"></div>${l.spots.map((s,i)=>`<button class="hotspot ${state.spots.includes(spotKey(id,i))?"found":""}" style="left:${s.x}%;top:${s.y}%" data-spot="${i}" aria-label="调查 ${s.n}"></button>`).join("")}</div><aside class="scene-side"><p class="file-ref">LOCATION DOSSIER</p><h3>${displayName}</h3><p>${l.desc}</p><div class="hotspot-log">${l.spots.map((s,i)=>`<div class="${state.spots.includes(spotKey(id,i))?"found":""}">${spotHasNew(l,s)?"!":state.spots.includes(spotKey(id,i))?"■":"□"} ${s.n}${s.obs?" · 环境观察":""}</div>`).join("")}</div></aside></div>`;}
  function evidenceChapter(id){const n=+id.slice(1);if(n<=8)return 1;if(n<=24)return 2;if(n<=36)return 3;if(n<=45)return 5;if(n<=60)return 4;if(n<=68)return 5;if(n===69)return 3;if([70,71,74].includes(n))return 4;if(n===72||n===73)return 5;return 2;}
  function inspectSpot(index){const l=locations.find(x=>x.id===activeLocation),s=l.spots[index],key=spotKey(l.id,index);if(!state.spots.includes(key))state.spots.push(key);const eligible=s.ids.filter(id=>evidenceAvailable(id)&&id!=="E057"&&!(id==="E059"&&state.destroyedE059));save();
    if(s.obs){openModal("环境观察 / "+s.n,`<span class="stamp">${locationName(l)}</span><h3>${s.n}</h3><div class="document"><p>${s.obs}</p></div><div class="callout">这段观察不会生成证物编号，也不影响章节推进。</div>`);renderLocation(l.id);return;}
    if(l.id==="news"&&index===1&&!has("E043")){showAnswerMachine();return;}
    if(l.id==="studio"&&index===3&&!state.photo){if(state.chapter<4||chapter4Phase()<3){openModal("墙柜暗格",`<h3>一卷严重曝光的底片</h3><p>${state.chapter<4?"当前设备无法恢复影像。需要先调阅 1992 年档案，建立参照时间。":"旧案的篡改链尚未闭合。先完成报告去向与资金流核查，再决定如何读取底片。"}</p>`);renderLocation(l.id);return;}startPuzzle("08");return;}
    const items=eligible.map(id=>evidence[id]).filter(Boolean);if(items.length>1){openModal("现场勘查 / "+s.n,`<span class="stamp">${locationName(l)}</span><h3>${s.n}</h3><p>该区域包含 ${items.length} 项可独立查看的材料。逐件检查后才能入库。</p><div class="grid grid-2">${items.map(e=>`<div class="card"><span class="file-ref">${e.id}</span><h3>${e.name}</h3><p>${has(e.id)?"已完成取证":"尚未查看正文"}</p><button class="action" data-collect-evidence="${e.id}">${has(e.id)?"重新查看":"检查并入库"}</button></div>`).join("")}</div>`);}else if(items.length===1){addEvidence([items[0].id],false);openModal("现场勘查 / "+s.n,`<span class="stamp">${locationName(l)}</span><h3>${s.n}</h3><div class="document"><span class="file-ref">${items[0].id} / 原始材料</span><h3>${items[0].name}</h3><p>${items[0].desc}</p></div>`);}else openModal("现场勘查 / "+s.n,`<span class="stamp">${locationName(l)}</span><h3>${s.n}</h3><p>当前阶段未发现可独立入库的证物。环境观察已经记录。</p>`);renderLocation(l.id);}
  function collectEvidence(id){const e=evidence[id];addEvidence([id],false);openModal("证物入库 / "+id,`<span class="stamp">${e.source}</span><h3>${e.name}</h3><div class="document"><p>${e.desc}</p></div><div class="callout">该材料只记录可观察事实；鉴定与推论需要在推理板另行完成。</div>`);}

  const interviewNeeds={
    chen:{2:["E055"],3:["E050","E055","E057"]},zhou:{2:["E048","E074"],3:["D:T08A","E048","E053","E074"]},xu:{2:["E032"],3:["E032","E057"]},
    sun:{2:["E042","E043"],3:["E043","E057","E072"]},zhao:{2:["E052"],3:["D:T08B","E052","E053"]},huang:{2:["D:T09A","E062","E063"],3:["D:T09B","E032","E034","E057","E073"]},lin:{2:["E056"],3:["E051","E056","E071"]}
  };
  function interviewGate(id,round){const need=interviewNeeds[id]?.[round]||[];const missing=need.filter(x=>x.startsWith("D:")?!hasD(x.slice(2)):!has(x));return {ok:!missing.length,missing:missing.map(x=>x.startsWith("D:")?deductions.find(d=>d.id===x.slice(2))?.name:evidence[x]?.name).filter(Boolean)};}
  function personJob(p){return p.id==="huang"&&hasD("T09A")?"17 路晚班司机":p.job;}
  function renderPeople(){const visible=people.filter(p=>p.ch<=state.chapter);root.innerHTML=`<div class="section-intro"><p>人物档案随调查逐步加入。每轮审讯都需要能击穿当前口供的证据，无法通过连续点击提前获得结论。</p><span class="tag amber">口供需由证据核查</span></div><div class="grid grid-3">${visible.map((p,i)=>{const r=state.interviews[p.id]||0,g=interviewGate(p.id,Math.min(r+1,3));return `<article class="card person-card"><div class="portrait">${p.initial}</div><span class="person-index">${String(i+1).padStart(2,"0")}</span><h3>${p.name}</h3><p>${p.age} 岁 / ${personJob(p)}</p><p>${p.bio}</p><div>${r?`<span class="tag">已审讯 ${r}/3</span>`:"<span class='tag dim'>尚未审讯</span>"}${p.id==="huang"&&r<2?"<span class='tag'>普通证人</span>":""}</div><div class="action-row"><button class="action" data-person="${p.id}" ${r<3&&!g.ok?"disabled":""}>${r>=3?"查看结论":idLabel(p.id,r)}</button></div>${r<3&&!g.ok?`<p class="file-ref">需补充 ${g.missing.length} 项矛盾材料</p>`:""}</article>`}).join("")}</div>`;}
  function idLabel(id,r){return id==="huang"&&r===2?"进入最终证据攻防":`进行第 ${r+1} 轮`;}
  function interview(id){const p=people.find(x=>x.id===id);let r=state.interviews[id]||0;if(r>=3){openModal("人物结论",`<h3>${p.name}</h3><p>${p.truth}</p>`);return;}const gate=interviewGate(id,r+1);if(!gate.ok){openModal("审讯条件不足",`<div class="gate-box"><h3>当前口供无法被击穿</h3><p>还缺少能直接形成矛盾的材料：${gate.missing.join("、")}。</p></div>`);return;}if(id==="huang"&&r===2){showHuangConfrontation();return;}r++;state.interviews[id]=r;action({minutes:25});if(id==="zhou"&&r===3&&state.destroyedE059)addEvidence(["E059"],true,true);save();openModal(`审讯记录 / 第 ${r} 轮`,`<span class="stamp">口供可信度 ★★</span><h3>${p.name}</h3><p>“${p.rounds[r-1]}”</p><div class="callout">调查员批注：${r===1?"记录陈述，暂不采信。":r===2?"口供与出示证据形成可核查矛盾。":"证据链完成，最终陈述已归档。"}</div>`);renderPeople();}
  const huangConfrontation=[
    {claim:"“我不认识林凯。那本日历上的‘黄’不是我。”",correct:"E034",prompt:"先证明林凯与一名黄姓人物约定过底片交接。",choices:["E034","E035","E042"]},
    {claim:"“姓黄的人很多。那场火和我没有关系。”",correct:"E073",prompt:"再证明黄启与旧案中的黄志远存在直接身份关系。",choices:["E073","E054","E047"]},
    {claim:"“那张照片已经证明我爸进了仓库。他就是纵火者。”",correct:"E057",prompt:"最后用完整序列推翻他只看过的裁切画面。",choices:["E057","E032","E050"]}
  ];
  function showHuangConfrontation(){const step=Math.min(state.huangConfrontation,2),c=huangConfrontation[step],html=`<span class="stamp">FINAL CONFRONTATION / ${step+1} OF 3</span><h3>黄启证据攻防</h3><blockquote>${c.claim}</blockquote><p>${c.prompt}</p><div class="grid grid-3 confrontation-grid">${c.choices.map(id=>`<button class="card evidence-choice" data-huang-evidence="${id}"><span class="file-ref">${id}</span><b>${evidence[id].name}</b><small>${evidence[id].source}</small></button>`).join("")}</div><div class="callout">选择能够直接反驳当前一句口供的证物。动机或相近事实不能代替这一步证明。</div>`;if(modal.open){$("#modal-label").textContent="最终审讯 / 黄启";modalBody.innerHTML=html;}else openModal("最终审讯 / 黄启",html);}
  function confrontHuang(id){const step=state.huangConfrontation,c=huangConfrontation[step];if(!c)return;if(id!==c.correct){state.wrong++;action({minutes:10,pressure:1,waste:true});toast("这件材料不能直接反驳当前口供");return;}state.huangConfrontation++;if(state.huangConfrontation<huangConfrontation.length){save();toast("口供出现矛盾，继续追问");showHuangConfrontation();return;}state.interviews.huang=3;action({minutes:25});save();modalBody.innerHTML=`<span class="stamp">CONFESSION RECORDED</span><h3>黄启最终陈述</h3><p>“我只看到他进仓。他们会再说我爸纵火。我不能让那卷照片出去。”</p><div class="callout">E034 建立会面，E073 建立父子身份，E057 推翻裁切照片。三次口供已由不同事实逐层击穿。</div>`;toast("最终审讯完成：黄启口供已归档");renderPeople();}

  function renderEvidence(){
    const owned=state.evidence.map(id=>evidence[id]).filter(Boolean);
    const findingCards=state.findings.map(id=>findings[id]&&`<article class="card evidence-card"><span class="file-ref">${id} / ANALYSIS</span><h3>${findings[id].name}</h3><p>${findings[id].desc}</p></article>`).filter(Boolean).join("");
    const intro=`<div class="section-intro"><p>原始证物只记录可观察事实；完成比对后产生鉴定记录，再由多来源材料形成推论。材料是否关键，取决于它能否支撑当前论证。</p><span class="tag">${owned.length} / 75 已入库 · ${state.findings.length} 项鉴定</span></div>${findingCards?`<h3 class="section-label">鉴定记录</h3><div class="grid grid-3" style="margin-bottom:20px">${findingCards}</div><h3 class="section-label">原始证物</h3>`:""}`;
    if(!owned.length){root.innerHTML=intro+`<div class="empty">尚无证物入库。请先访问案发地点。</div>`;return;}
    const cards=owned.map(e=>`<article class="card evidence-card ${state.selected.includes(e.id)?"selected":""}"><div class="evidence-icon">${e.id.slice(1)}</div><span class="file-ref">${e.id} / ${"★".repeat(e.stars)}${"☆".repeat(5-e.stars)}</span><h3>${e.name}</h3><p>${e.source}</p><div class="evidence-actions"><button class="action btn-small" data-evidence-view="${e.id}">阅读全文</button><button class="action btn-small ${state.selected.includes(e.id)?"selected":""}" data-evidence-select="${e.id}">${state.selected.includes(e.id)?"已加入":"加入推理"}</button></div></article>`).join("");
    const selection=state.selected.length?`已选择：${state.selected.join(" + ")}`:"选择最多 5 件证物进行组合分析";
    root.innerHTML=intro+`<div class="grid grid-3">${cards}</div><div class="combine-tray"><span>${selection}</span><div class="action-row" style="margin:0"><button class="action" data-clear-selection>清空</button><button class="action primary" data-combine>组合分析</button></div></div>`;
  }
  function viewEvidence(id){const e=evidence[id],log=state.evidenceLog[id]||{};openModal(`证物档案 / ${id}`,`<span class="stamp">原始材料</span><h3>${e.name}</h3><div class="evidence-meta"><div><small>发现地点</small><b>${e.source}</b></div><div><small>取得时间</small><b>${log.chapter?`第 ${log.chapter} 章 / ${log.time}`:"旧存档记录"}</b></div><div><small>来源完整度</small><b>${"★".repeat(e.stars)}${"☆".repeat(5-e.stars)}</b></div><div><small>分析状态</small><b>${state.selected.includes(id)?"已加入当前论证":"尚未加入论证"}</b></div></div><div class="document"><p>${e.desc}</p></div><div class="callout">调查员批注：材料本身只说明已经记录的事实。它指向谁、能否排除其他解释，需要交叉验证。</div><div class="action-row"><button class="action primary" data-evidence-add-from-modal="${id}">${state.selected.includes(id)?"从推理板移除":"加入推理板"}</button></div>`);}
  function selectEvidence(id){if(state.selected.includes(id))state.selected=state.selected.filter(x=>x!==id);else if(state.selected.length<5)state.selected.push(id);else toast("一次最多选择 5 件证物");renderEvidence();}
  function combine(){const ready=d=>(!d.needsD||d.needsD.every(hasD))&&(!d.needsF||d.needsF.every(hasF));const match=deductions.find(d=>!hasD(d.id)&&ready(d)&&d.need.length===state.selected.length&&d.need.every(id=>state.selected.includes(id)));if(match){addDeduction(match.id);state.selected=[];save();renderEvidence();return;}const candidates=deductions.filter(d=>!hasD(d.id)&&ready(d)&&d.need.some(id=>state.selected.includes(id))).map(d=>({d,hit:d.need.filter(id=>state.selected.includes(id)),missing:d.need.filter(id=>!state.selected.includes(id)),extra:state.selected.filter(id=>!d.need.includes(id))})).sort((a,b)=>b.hit.length-a.hit.length);const near=candidates[0];state.wrong++;action({minutes:15,pressure:1,waste:true});let feedback="当前证物之间缺少可验证的直接联系。";if(near?.hit.length){const dimensions=near.missing.map(id=>{const e=evidence[id];return e?.source.includes("公交")?"交通记录":e?.source.includes("警局")?"官方档案":e?.source.includes("摄影")||e?.source.includes("仓库")?"现场影像材料":"另一来源的交叉材料"});feedback=`当前材料已经支持部分事实，但论证仍缺少 ${near.missing.length} 条${[...new Set(dimensions)].join("、")}。${near.extra.length?`另有 ${near.extra.length} 条材料没有直接支撑当前论证，请先剔除。`:""}`;}openModal("组合分析",`<h3>论证尚未闭合</h3><p>${feedback}</p>`);updateChrome();}

  const timelineCases=[
    {name:"CASE 01 / 唐辉",events:[{e:"17 路回站",a:"23:18"},{e:"电话亭拨号",a:"23:21"},{e:"唐辉离开酒吧",a:"23:24"},{e:"预计死亡",a:"23:31"}]},
    {name:"CASE 02 / 吴峰",events:[{e:"17 路回站",a:"21:51"},{e:"电话亭拨号",a:"21:54"},{e:"吴峰进入通道",a:"22:03"},{e:"预计死亡",a:"22:11"}]},
    {name:"CASE 03 / 方蓉",events:[{e:"17 路回站",a:"20:46"},{e:"电话亭拨号",a:"20:49"},{e:"方蓉已离开住处",a:"20:52"},{e:"预计死亡",a:"21:04"}]},
    {name:"CASE 04 / 林凯",events:[{e:"17 路回站",a:"22:21"},{e:"电话亭拨号",a:"22:26"},{e:"林凯抵达仓库",a:"22:37"},{e:"预计死亡",a:"22:47"}]}
  ];
  const timelineEvents=timelineCases.flatMap(c=>c.events);
  const timelineRequired=["E001","E005","E008","E009","E012","E014","E017","E021","E024","E025","E030","E036","E062","E063"];
  function renderTimeline(){if(state.chapter<6){root.innerHTML=`<div class="empty">四案排班重建将在最终章开放。</div>`;return;}const missing=timelineRequired.filter(id=>!has(id));if(missing.length){root.innerHTML=`<div class="gate-box"><h3>时间线材料不足</h3><p>你还缺少 ${missing.length} 项来自尸检、死者日程、电话或公交总站的时间记录。四案必须全部核对，不能以两案代替。</p></div>`;return;}let offset=0;root.innerHTML=`<div class="section-intro"><p>逐案重建“回站 → 电话 → 受害者出现 → 死亡”的完整链条，亲自验证四个机会窗口。</p><span class="tag ${state.timeline?"amber":""}">${state.timeline?"四案已验证":"待重建"}</span></div>${timelineCases.map(c=>{const times=[...new Set(c.events.map(e=>e.a).concat(c.events.map(e=>addMinutes(e.a,6))))].sort();const html=`<div class="card" style="margin-bottom:16px"><h3>${c.name}</h3><div class="timeline-form">${c.events.map((x,j)=>{const i=offset+j;return `<div class="timeline-event" data-time="${j+1}"><b>${x.e}</b><select data-time-select="${i}"><option value="">选择时间</option>${times.map(t=>`<option ${state.timeline&&t===x.a?"selected":""}>${t}</option>`).join("")}</select></div>`}).join("")}</div></div>`;offset+=c.events.length;return html}).join("")}<div class="action-row"><button class="action primary" data-check-timeline>核对四案时间线</button></div>`;}
  function checkTimeline(){const vals=$$("[data-time-select]").map(s=>s.value);if(vals.every((v,i)=>v===timelineEvents[i].a)){state.timeline=true;addPuzzle("13");addDeduction("T09B");save();toast("四案时间线验证完成：同一司机每次都具备机会窗口");renderTimeline();}else{state.wrong++;action({minutes:15,pressure:1,waste:true});toast("至少一案的时间顺序存在冲突，请分别核对尸检与回站记录");}}

  const puzzles=[
    {id:"01",ch:1,name:"公交票样比对",requires:["E004"],suggest:"电影院后巷排水沟",q:"将残片底纹、线路码和检票孔与三种旧票样叠合，哪一种完全吻合？",opts:["12 路","17 路","23 路"],a:1,finding:"F01"},
    {id:"02",ch:1,name:"唐辉行动路线",requires:["E005"],suggest:"唐辉酒吧",q:"唐辉被选择的关键是什么？",opts:["债务","固定下班路线","酒吧身份"],a:1,d:"T01"},
    {id:"03",ch:2,name:"门牌簿核查",requires:["E012","E013"],suggest:"地下排水通道",q:"将纸条地址与新旧门牌簿比对，北七巷 17-4 的登记情况是？",opts:["已拆迁注销","从未登记存在","临时门牌"],a:1,finding:"F02"},
    {id:"04",ch:2,name:"前三人共同点",requires:["E005","E013","E021"],requiresF:["F02"],suggest:"三名死者的日常记录与门牌核查",q:"职业年龄各异，真正共同点是？",opts:["反拆迁","旧案亲属","固定时间、路线且独行"],a:2,d:"T03"},
    {id:"05",ch:3,name:"黑色相纸与真正目标",requires:["E003","E011","E019","E027","E028","E029","E033"],suggest:"林凯摄影工作室与河滨仓库",custom:"paper"},
    {id:"06",ch:4,name:"卷宗装订鉴定",requires:["E047","E048"],suggest:"警局旧档",q:"对照纤维断口、装订线和相邻页磨损，缺页如何形成？",opts:["长期自然脱落","目录编号错误","沿装订线人为撕除"],a:2,finding:"F03"},
    {id:"07",ch:4,name:"火灾平面图",requires:["E049","E060"],suggest:"北七印刷厂旧址",q:"旧报告称停电导致消防门失效，问题在哪？",opts:["门是机械结构","消防门不存在","电源在室外"],a:0,d:"T08A"},
    {id:"08",ch:4,name:"旧照片显影",requires:["E032","E050","E051"],suggest:"二手书店与电影院地下室",custom:"photo"},
    {id:"09",ch:4,name:"财务路径追踪",requires:["E052","E053"],suggest:"印刷厂旧址与赵氏地产",q:"对照账本缩写与付款记录，ZC-92-12 最终流向？",opts:["陈岚诊所","周成亲属商店","林正国报社"],a:1,finding:"F04"},
    {id:"10",ch:5,name:"第五案异常对比",requires:["E037","E038","E039","E040","E043"],suggest:"电话亭路口与报社",custom:"caseCompare"},
    {id:"11",ch:5,name:"魏安答录机",requires:["E042"],suggest:"报社桌面",custom:"phone"},
    {id:"12",ch:5,name:"公交线路覆盖",requires:["E004","E005","E021","E061"],requiresF:["F01"],suggest:"票样鉴定、线路册与前三案日程",q:"哪条路线能在合理步行范围内覆盖前三名死者的固定活动区域？",opts:["12 路","17 路","31 路"],a:1,d:"T09A"},
    {id:"13",ch:6,name:"四案排班时间窗口",requires:["E001","E005","E008","E009","E012","E014","E017","E021","E024","E025","E030","E062","E063"],suggest:"尸检、入口记录、电话记录与总站调度室",custom:"timeline"},
    {id:"14",ch:6,name:"第五案车辆匹配",requires:["E040","E044","E045","E067"],suggest:"第五案路口、三车拓片与维修钥匙表",q:"将胎纹、轴距、油漆层和出入缺口逐项叠合，哪辆车同时吻合？",opts:["维修 A 车","维修 B 车","维修 C 车"],a:1,finding:"F05"},
    {id:"15",ch:6,name:"最终案件重建",requires:["E057","E073"],requiresD:["T04B","T05","T09A","T09B"],suggest:"完整底片、黄启关系与两项公交推论",custom:"report"}
  ];
  function puzzleGate(p){const missing=(p.requires||[]).filter(id=>!has(id)).map(id=>evidence[id]?.name);const missingD=(p.requiresD||[]).filter(id=>!hasD(id)).map(id=>deductions.find(d=>d.id===id)?.name);const missingF=(p.requiresF||[]).filter(id=>!hasF(id)).map(id=>findings[id]?.name);return {ok:!missing.length&&!missingD.length&&!missingF.length,missing:[...missing,...missingD,...missingF].filter(Boolean)};}
  function renderBoard(){root.innerHTML=`<div class="board-layout"><div class="board-canvas">${deductions.map(d=>`<div class="theory-note ${hasD(d.id)?"":"locked"}"><strong>${hasD(d.id)?d.name:"[ 推论未建立 ]"}</strong>${hasD(d.id)?d.desc:`需要 ${d.need.length} 件证物${d.needsD?"和前置推论":""}`}</div>`).join("")}</div><aside class="theory-panel"><h3>核心谜题</h3><p class="file-ref">SOLVED ${state.puzzles.length} / 15</p>${puzzles.filter(p=>p.ch<=state.chapter).map(p=>{const g=puzzleGate(p);return `<div class="deduction"><b>${state.puzzles.includes(p.id)?"■":g.ok?"□":"▣"} ${p.id} ${p.name}</b><small>${state.puzzles.includes(p.id)?"已完成":g.ok?"分析条件已满足":`条件不足 · 缺 ${g.missing.length} 项材料`}</small><div class="action-row"><button class="action btn-small" data-puzzle="${p.id}">${state.puzzles.includes(p.id)?"复核":g.ok?"开始":"查看条件"}</button></div></div>`}).join("")}</aside></div>`;}
  function startPuzzle(id){const p=puzzles.find(x=>x.id===id),gate=puzzleGate(p);if(!gate.ok){openModal("分析条件不足",`<div class="gate-box"><h3>现在不能开始这项推理</h3><p>当前缺少 ${gate.missing.length} 项前置材料：${gate.missing.join("、")}。</p><div class="callout">建议调查：${p.suggest}</div></div>`);return;}if(p.custom==="paper"){showPaperPuzzle();return;}if(p.custom==="caseCompare"){showCaseCompare();return;}if(p.custom==="photo"){showPhotoPuzzle();return;}if(p.custom==="phone"){showAnswerMachine();return;}if(p.custom==="timeline"){closeModal();navigate("timeline");return;}if(p.custom==="report"){closeModal();navigate("report");return;}openModal(`谜题 ${p.id} / ${p.name}`,`<h3>${p.q}</h3><div class="action-row">${p.opts.map((o,i)=>`<button class="action" data-answer="${p.id}:${i}">${o}</button>`).join("")}</div>`);}
  function answerPuzzle(pid,choice){if(pid==="01"&&+choice===1){addFinding("F01");addPuzzle("01");closeModal();toast("票样鉴定完成");render();return;}if(pid==="05a"){if(+choice===1){addDeduction("T04A");openModal("谜题 05 / 第二步",`<h3>凶手为何只取走林凯相机中的胶卷？</h3><p>相纸来源已经确认，但这还不能证明犯罪结构。</p><div class="action-row"><button class="action" data-answer="05b:0">林凯只是随机的第四名死者</button><button class="action" data-answer="05b:1">林凯是目标，前三案复制了他的特征</button></div>`);}else wrongPuzzle();return;}if(pid==="05b"){if(+choice===1){addDeduction("T04B");addPuzzle("05");closeModal();toast("两步推理完成：第四案结构得到解释");render();}else wrongPuzzle();return;}const p=puzzles.find(x=>x.id===pid);if(+choice===p.a){addPuzzle(pid);if(p.finding)addFinding(p.finding);if(p.reward)addEvidence(p.reward);if(p.d)addDeduction(p.d);closeModal();toast(`分析完成：${p.name}`);render();}else wrongPuzzle();}
  function wrongPuzzle(){state.wrong++;action({minutes:15,pressure:1,waste:true});toast("这个结论无法解释全部证据");updateChrome();}
  function showPaperPuzzle(){openModal("谜题 05 / 第一步",`<h3>四案黑色相纸的共同来源是什么？</h3><p>请对照批次、切口与林凯暗房垃圾袋。</p><div class="action-row"><button class="action" data-answer="05a:0">北七印刷厂库存</button><button class="action" data-answer="05a:1">林凯摄影工作室暗房</button><button class="action" data-answer="05a:2">警方物证耗材</button></div>`);}
  const caseComparisonRows=[
    {id:"date",label:"案发日",v:["周五","周五","周五","周五","周日"],breaks:true},
    {id:"call",label:"目标行动前来电",v:["有","有","有（未接）","有","无"],breaks:true},
    {id:"paper",label:"黑色相纸形态",v:["整片","整片","整片","整片","小块撕片"],breaks:true},
    {id:"number",label:"现场数字",v:["1","2","3","4","5"],breaks:false},
    {id:"distance",label:"距公交线路步行范围",v:["近","近","近","近","近"],breaks:false},
    {id:"method",label:"死亡方式",v:["重击","溺水","窒息","锐器失血","车辆撞击"],breaks:false},
    {id:"writing",label:"数字笔迹",v:["稳定","稳定","稳定","稳定","倾斜重描"],breaks:true},
    {id:"setup",label:"现场预置痕迹",v:["有","有","有","有","未发现"],breaks:true}
  ];
  function showCaseCompare(){openModal("谜题 10 / 五案横向复核",`<h3 tabindex="-1" data-autofocus>哪些特征真正破坏了前四案模式？</h3><p>表格只列事实。第五案仍然相同的项目也混在其中，请不要把所有差异都当成模式断裂。</p><div class="case-table-wrap"><table class="case-compare"><thead><tr><th>特征</th><th>01</th><th>02</th><th>03</th><th>04</th><th>05</th><th>判断</th></tr></thead><tbody>${caseComparisonRows.map(r=>`<tr><td>${r.label}</td>${r.v.map(v=>`<td>${v}</td>`).join("")}<td><label><input type="checkbox" data-case-anomaly="${r.id}"> 破坏模式</label></td></tr>`).join("")}</tbody></table></div><label>根据被破坏的模式判断第五案性质</label><select id="case5-nature"><option value="">选择结论</option><option value="copy">独立模仿犯罪</option><option value="silence">发现调查后发生的临时灭口</option><option value="accident">与前四案无关的交通意外</option></select><div class="action-row"><button class="action primary" data-case-compare-submit>提交横向分析</button></div>`);modal.classList.add("modal-wide");}
  function solveCaseCompare(){const selected=$$("[data-case-anomaly]:checked").map(x=>x.dataset.caseAnomaly),correct=caseComparisonRows.filter(r=>r.breaks).map(r=>r.id),missing=correct.filter(id=>!selected.includes(id)),extra=selected.filter(id=>!correct.includes(id)),nature=$("#case5-nature").value;if(!missing.length&&!extra.length&&nature==="silence"){addFinding("F06");addDeduction("T05");addPuzzle("10");closeModal();toast("五案横向比较完成");render();}else{state.wrong++;action({minutes:15,pressure:1,waste:true});toast(missing.length||extra.length?`模式判断仍有 ${missing.length+extra.length} 项无法自洽`:"事实比较成立，但案件性质仍未解释");}}
  function showAnswerMachine(){openModal("谜题 11 / 魏安答录机",`<h3>请输入四位密码</h3><p>桌上的日期：1119 / 1126 / 1203。便签提示只有三个字：<b>“下一次”</b>。</p><input id="phone-code" maxlength="4" inputmode="numeric" placeholder="0000" style="background:#0e1716;border:1px solid #52685f;color:white;padding:12px;font:22px var(--mono);letter-spacing:.4em"><div class="action-row"><button class="action primary" data-phone-submit>播放留言</button></div>`);}
  function solvePhone(){if($("#phone-code").value==="1210"){addPuzzle("11");addEvidence(["E043"]);closeModal();toast("留言已提取为 E043");render();}else{state.wrong++;action({minutes:15,pressure:1,waste:true});toast("密码错误");}}
  function showPhotoPuzzle(){openModal("谜题 08 / 底片恢复",`<h3>恢复 1992 年底片序列</h3><p>调整曝光与对比度，使不同区域达到可读状态。系统只报告整体清晰度，不解释画面内容。</p><div class="photo-puzzle"><div id="photo-frame" class="photo-frame"></div><div class="puzzle-controls"><label>曝光亮度</label><input id="bright" aria-label="曝光亮度" type="range" min="20" max="100" value="55"><label>对比度</label><input id="contrast" aria-label="对比度" type="range" min="70" max="180" value="100"><div class="photo-readout"><div id="read-quality">影像清晰度：低</div></div><div class="action-row"><button class="action primary" data-photo-submit>固定显影参数</button></div></div></div>`);bindPhoto();}
  function bindPhoto(){const b=$("#bright"),c=$("#contrast"),f=$("#photo-frame");const up=()=>{const bv=+b.value,cv=+c.value;f.style.setProperty("--bright",bv/100);f.style.setProperty("--contrast",cv/100);const reveal=Math.max(.08,1-(Math.abs(bv-80)+Math.abs(cv-140)/2)/70);f.style.setProperty("--reveal",reveal);const score=Math.abs(bv-80)+Math.abs(cv-140)/2;$("#read-quality").textContent=`影像清晰度：${score<=10?"高":score<=28?"中":"低"}`};b.oninput=up;c.oninput=up;up();}
  function solvePhoto(){const b=+$("#bright").value,c=+$("#contrast").value;if(b>=76&&b<=84&&c>=132&&c<=148){openModal("底片观察记录",`<h3>读取已恢复的连续画面</h3><p>不要依赖旧报告。只回答画面中可以直接观察到的事实。</p><label>起火前最后离开档案仓附近的人是谁？</label><select id="photo-q1"><option value="">选择人物</option><option value="huang">黄志远</option><option value="luo">罗晋川</option><option value="zhou">周成</option></select><label style="display:block;margin-top:14px">起火后，黄志远在消防门处做了什么？</label><select id="photo-q2"><option value="">选择行为</option><option value="lock">锁上消防门</option><option value="break">从内部破坏卡死的门锁</option><option value="carry">搬运账本</option></select><div class="action-row"><button class="action primary" data-photo-observe>提交观察记录</button></div>`);}else{toast("影像清晰度不足，局部细节互相冲突");}}
  function solvePhotoObservation(){if($("#photo-q1").value==="luo"&&$("#photo-q2").value==="break"){state.photo=true;addPuzzle("08");addEvidence(["E057"]);addFinding("F07");addDeduction("T07");closeModal();toast("底片观察记录完成");render();}else{state.wrong++;action({minutes:10,pressure:1,waste:true});toast("观察记录与连续画面不符，请重新读取");}}

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
  function submitReport(form){const data=new FormData(form);const raw=reportQs.map((_,i)=>data.get(`q${i}`));if(raw.some(v=>v===""||v===null)){toast("报告仍有未完成项目");return;}const vals=raw.map(Number);const score=vals.filter((v,i)=>v===reportQs[i].a).length;const suspect=vals[9],relatedTitle=$("#report-title").selectedIndex===1,constructed=$("#classification").value==="constructed",hidden=relatedTitle&&constructed,serialNarrative=!relatedTitle&&!constructed;
    const fullOld=["E047","E048","E049","E050","E051","E052","E053","E054","E055","E056","E057","E059","E060"].every(has);const fullLogic=["T04B","T05","T08C","T09A","T09B","T10"].every(hasD)&&state.timeline;
    let type;if(suspect!==2||score<7)type="C";else if(state.sunOutcome==="dead")type="D";else if(score===10&&state.photo&&hidden&&fullOld&&fullLogic)type="E";else if(score===10&&state.photo&&serialNarrative)type="B";else if(score===10&&state.photo)type="A";else type="B";state.ending={type,score,suspect};addPuzzle("15");save();renderEnding();}
  function renderEnding(){const endings={
    A:{kind:"真结局",title:"照片上的人",text:"黄启认罪。1992 年北七印刷厂火灾重新立案，罗晋川纵火、赵启明与周成掩盖证据的事实被公开。黄志远的档案终于从“失踪嫌疑人”改为“遇难救援者”。",quote:"所以我杀的那个人……原本是唯一想替他证明清白的人。"},
    B:{kind:"普通结局",title:"七码头杀手",text:"你找到了黄启，也找到了照片，但报告仍沿用了“七码头连环杀手”的解释。案件告破，1992 年旧案得到部分纠正；前三名无关死者为什么存在，却没有被公众真正理解。",quote:"抓到凶手并不等于拆掉他制造的故事。"},
    C:{kind:"错误结局",title:"错误的人",text:"周成被暂时拘留。二十四小时后，真正的凶手消失，街区另一面墙上出现了数字 6。你的证据解释不了你写下的名字。",quote:"证据不足时，结论只是另一种先入为主。"},
    D:{kind:"黑暗结局",title:"第六个数字",text:"黄启最终被捕，但孙倩没能从公交总站回来。墙上的数字从五变成六，一个本来可以被阻止的意外成为了新的案卷。",quote:"当一个谎言需要新的死亡维持时，它已经不再需要理由。"},
    E:{kind:"隐藏结局",title:"没有连环杀手",text:"报告拒绝沿用媒体创造的标题。唐辉、吴峰、方蓉并非因共同身份死亡；林凯才是犯罪中心。五起命案被重新定义，黄志远恢复名誉，所有参与掩盖旧案的人接受调查。",quote:"证据本身不会说话。人会选择怎样理解它。"}
  };if(state.ending.type==="C"){const s=state.ending.suspect;endings.C.text=s===0?"周成因旧案篡改证据被控制，但现案证据无法支持五项谋杀指控。二十四小时后，真正凶手失踪，街区出现数字 6。":s===1?"赵启明因妨碍调查与旧案行贿被拘留，但检方发现他不具备四案稳定机会。真正凶手在证据缺口中消失。":"黄启被临时控制，但报告无法解释五案结构，检方拒绝以完整罪名移送。一次仓促指认让关键证据失去效力。";}const e=endings[state.ending.type];root.innerHTML=`<div class="ending"><span class="ending-type">${e.kind} / REPORT SCORE ${state.ending.score}/10</span><h3>《${e.title}》</h3><p>${e.text}</p><blockquote>${e.quote}</blockquote><p class="file-ref">CASE LC-04-1207 // CLOSED</p><div class="ending-actions"><button class="action" data-retry-report>修改报告</button><button class="action primary" data-back-title>返回标题</button></div></div>`;updateChrome();}

  function protectSun(){if(state.sunSafe){toast("孙倩已进入保护程序");return;}if(state.sunOutcome!=="pending"){toast(state.sunOutcome==="dead"?"保护申请已错过：孙倩失联":"保护申请已错过：孙倩已经受伤");return;}state.sunSafe=true;state.sunOutcome="safe";action({minutes:12});save();toast("已安排警员保护孙倩");render();}

  document.addEventListener("click",e=>{
    const nav=e.target.closest("[data-view],[data-nav]");if(nav){navigate(nav.dataset.view||nav.dataset.nav);return;}
    if(e.target.closest("[data-desk='intake']")){intake();return;}if(e.target.closest("[data-desk='advance']")){advance();return;}
    const loc=e.target.closest("[data-loc]");if(loc){renderLocation(loc.dataset.loc);return;}if(e.target.closest("[data-back-map]")){activeLocation=null;navigate("map");return;}
    const sp=e.target.closest("[data-spot]");if(sp){inspectSpot(+sp.dataset.spot);return;}
    const collect=e.target.closest("[data-collect-evidence]");if(collect){collectEvidence(collect.dataset.collectEvidence);return;}
    const per=e.target.closest("[data-person]");if(per){interview(per.dataset.person);return;}
    const confront=e.target.closest("[data-huang-evidence]");if(confront){confrontHuang(confront.dataset.huangEvidence);return;}
    const evView=e.target.closest("[data-evidence-view]");if(evView){viewEvidence(evView.dataset.evidenceView);return;}const evSelect=e.target.closest("[data-evidence-select]");if(evSelect){selectEvidence(evSelect.dataset.evidenceSelect);return;}const evModal=e.target.closest("[data-evidence-add-from-modal]");if(evModal){const id=evModal.dataset.evidenceAddFromModal;if(state.selected.includes(id))state.selected=state.selected.filter(x=>x!==id);else if(state.selected.length<5)state.selected.push(id);closeModal();renderEvidence();return;}
    if(e.target.closest("[data-clear-selection]")){state.selected=[];renderEvidence();return;}if(e.target.closest("[data-combine]")){combine();return;}
    const pu=e.target.closest("[data-puzzle]");if(pu){startPuzzle(pu.dataset.puzzle);return;}const ans=e.target.closest("[data-answer]");if(ans){const [p,c]=ans.dataset.answer.split(":");answerPuzzle(p,c);return;}
    if(e.target.closest("[data-phone-submit]")){solvePhone();return;}if(e.target.closest("[data-photo-submit]")){solvePhoto();return;}if(e.target.closest("[data-photo-observe]")){solvePhotoObservation();return;}if(e.target.closest("[data-case-compare-submit]")){solveCaseCompare();return;}if(e.target.closest("[data-check-timeline]")){checkTimeline();return;}
    if(e.target.closest("[data-protect-sun]")){protectSun();return;}if(e.target.closest("[data-retry-report]")){state.ending=null;save();renderReport();return;}if(e.target.closest("[data-back-title]")){shell.hidden=true;titleScreen.hidden=false;$("#continue-game").hidden=false;return;}
  });
  $("#modal-close").addEventListener("click",closeModal);modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});modal.addEventListener("close",()=>{if(openModal.returnFocus?.isConnected)openModal.returnFocus.focus()});
  $("#new-game").addEventListener("click",()=>{state=freshState();save();titleScreen.hidden=true;shell.hidden=false;navigate("desk")});
  $("#continue-game").addEventListener("click",()=>{load();titleScreen.hidden=true;shell.hidden=false;navigate("desk")});
  $("#save-game").addEventListener("click",()=>save(false));
  $("#reset-game").addEventListener("click",()=>{if(confirm("确定清除本机调查档案？此操作无法撤销。")){localStorage.removeItem(SAVE_KEY);state=freshState();shell.hidden=true;titleScreen.hidden=false;$("#continue-game").hidden=true;}});
  document.addEventListener("submit",e=>{if(e.target.id==="report-form"){e.preventDefault();submitReport(e.target);}});
  if(localStorage.getItem(SAVE_KEY))$("#continue-game").hidden=false;

  // Contextual fifth-chapter safety action appears on desk/task flow.
  const originalDesk=renderDesk;renderDesk=function(){originalDesk();if(state.chapter===5&&!state.sunSafe){const remain=Math.max(0,(state.sunDeadline??state.actions)-state.actions);root.insertAdjacentHTML("beforeend",`<div class="callout" style="margin-top:16px"><b>可选紧急行动：</b>${state.sunOutcome==="pending"?`孙倩准备独自前往公交总站。剩余调查行动：${remain}`:state.sunOutcome==="dead"?"孙倩已经失联。":"孙倩独自调查时受伤，已经送医。"}<div class="action-row"><button class="action red" data-protect-sun ${state.sunOutcome!=="pending"?"disabled":""}>申请警方保护（+1 行动）</button></div><small>忽略该行动不会阻止第五章结束，但会改变后续结局。</small></div>`);}};
})();
