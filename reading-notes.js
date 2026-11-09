"use strict";

// 對讀資料沿用原背誦工具的分次導讀。
const chapterStudy = [
  {
    "firstCard": 1,
    "desc": "記述佛陀日常乞食、敷座而坐的平凡生活，示現「佛法不離世間」，大乘般若智慧即在日常行住坐臥中。",
    "sanskrit": "舍衛國: Śrāvastī\n祇樹給孤獨園: Jetavana-anāthapiṇḍada-ārāma\n比丘: Bhikṣu",
    "lastCard": 1
  },
  {
    "firstCard": 2,
    "desc": "長老須菩提代表大眾啟請佛陀：善男子善女人發無上菩提心，應如何安住？如何降伏妄心？這開啟了《金剛經》的發心問答。",
    "sanskrit": "須菩提: Subhūti\n如來: Tathāgata\n阿耨多羅三藐三菩提: Anuttarā Samyak Saṃbodhi",
    "lastCard": 3
  },
  {
    "firstCard": 4,
    "desc": "佛陀答覆發心：應滅度一切眾生，而實無一眾生得滅度者。若菩薩心中有我相、人相、眾生相、壽者相的執著，即非真正的菩薩。",
    "sanskrit": "菩薩摩訶薩: Bodhisattva Mahāsattva\n涅槃: Nirvāṇa\n壽者相: Jīva-saṃjñā",
    "lastCard": 4
  },
  {
    "firstCard": 5,
    "desc": "菩薩修行布施，應無所住，不住於色聲香味觸法等六塵相。不住相布施的福德如虛空般不可思量，此為無相布施的妙行。",
    "sanskrit": "布施: Dāna\n法: Dharma\n福德: Puṇya",
    "lastCard": 6
  },
  {
    "firstCard": 7,
    "desc": "佛陀開示：不可以身相見如來，因如來身相即非身相。凡所有相皆是虛妄，若能透視「諸相非相」，當下即見如來本性。",
    "sanskrit": "身相: Lakṣaṇa\n虛妄: Abhūta",
    "lastCard": 7
  },
  {
    "firstCard": 8,
    "desc": "佛開示，若有持戒修福者，聞此經章句能生實信。此人不於一佛二佛種善根，已於無量佛所種善根。不應取法，亦不應取非法。",
    "sanskrit": "持戒: Śīla\n善根: Kuśalamūla\n筏喻: Kolôpama",
    "lastCard": 10
  },
  {
    "firstCard": 11,
    "desc": "如來無有定法得菩提，亦無定法可說。如來所說法皆不可取、不可說，非法非非法。一切賢聖皆以「無為法」而顯現差別。",
    "sanskrit": "無為法: Asaṃskṛta Dharma",
    "lastCard": 11
  },
  {
    "firstCard": 12,
    "desc": "即使以滿世界七寶布施，其福德亦不如受持本經四句偈並為他人演說。因為一切諸佛及無上菩提法，皆從此經典出生。",
    "sanskrit": "四句偈: Gāthā",
    "lastCard": 13
  },
  {
    "firstCard": 14,
    "desc": "從小乘四果（須陀洹、斯陀含、阿那含、阿羅漢）說明皆無果相可得。若自以為得果，即是執著我、人、眾生、壽者四相。",
    "sanskrit": "須陀洹: Srotāpanna | 斯陀含: Sakadāgāmin\n阿那含: Anāgāmin | 阿羅漢: Arhat",
    "lastCard": 17
  },
  {
    "firstCard": 18,
    "desc": "佛昔在然燈佛所，於法實無所得。菩薩莊嚴佛土，實非莊嚴，是名莊嚴。菩薩應生清淨心，應「無所住而生其心」。",
    "sanskrit": "然燈佛: Dīpaṃkara\n清淨心: Prasanna-citta\n無所住而生其心: Apratiṣṭhita-citta",
    "lastCard": 19
  },
  {
    "firstCard": 20,
    "desc": "以恆河沙數之七寶布施，福德極多。但若有人受持此經乃至四句偈，為他人演說，此「無為法」福德遠勝前者。",
    "sanskrit": "恆河: Gaṅgā",
    "lastCard": 21
  },
  {
    "firstCard": 22,
    "desc": "隨說是經乃至四句偈，當知此處一切天人阿修羅皆應供養如佛塔廟，何況盡能受持讀誦。經典所在之處，即為有佛。",
    "sanskrit": "阿修羅: Asura | 塔廟: Caitya",
    "lastCard": 22
  },
  {
    "firstCard": 23,
    "desc": "此經名為《金剛般若波羅蜜》，應如法奉持。佛說般若波羅蜜，即非般若波羅蜜。世界微塵，非微塵，是名微塵。",
    "sanskrit": "金剛般若波羅蜜: Vajracchedikā Prajñāpāramitā\n微塵: Aṇu",
    "lastCard": 25
  },
  {
    "firstCard": 26,
    "desc": "須菩提聞經深解義趣，涕淚悲泣。聞經信解受持者即是第一希有，離一切諸相即名諸佛。如來所得法，此法無實無虛。",
    "sanskrit": "實相: Dharmatā | 忍辱波羅蜜: Kṣānti-pāramitā\n歌利王: Kali-rāja",
    "lastCard": 32
  },
  {
    "firstCard": 33,
    "desc": "以身命布施無量百千萬億劫，不如聞此經典信心不逆。此經為發大乘者、發最上乘者說，能成就不可思議無邊功德。",
    "sanskrit": "大乘: Mahāyāna",
    "lastCard": 35
  },
  {
    "firstCard": 36,
    "desc": "受持讀誦此經若為人輕賤，是人先世罪業本應墮惡道，以今世被輕賤故，先世罪業消滅，當得無上菩提。",
    "sanskrit": "業障: Karmâvaraṇa | 惡道: Durgati",
    "lastCard": 38
  },
  {
    "firstCard": 39,
    "desc": "重提云何住與降伏其心，開示實無有法發菩提心者，實無有法得菩提。通達無我、無人、無眾生、無壽者法者，才是真菩薩。",
    "sanskrit": "菩提心: Bodhicitta | 無我: Anātman",
    "lastCard": 44
  },
  {
    "firstCard": 45,
    "desc": "如來具足五眼（肉、天、慧、法、佛眼），能悉知悉見恆河沙國土中一切眾生若干種心，然「過去、現在、未來心不可得」。",
    "sanskrit": "五眼: 肉眼 Māṃsa-cakṣus / 天眼 Divya-cakṣus / 慧眼 Prajñā-cakṣus / 法眼 Dharma-cakṣus / 佛眼 Buddha-cakṣus\n心: Citta",
    "lastCard": 47
  },
  {
    "firstCard": 48,
    "desc": "若人滿世界七寶布施，以因緣故得福甚多。然「以福德無故，如來說得福德多」，不可執著於因緣與相對的福德。",
    "sanskrit": "因緣: Hetu-pratyaya",
    "lastCard": 48
  },
  {
    "firstCard": 49,
    "desc": "如來不應以具足色身與具足諸相見。佛說具足色身與具足諸相，即非具足，是名具足，旨在破除對外在色相的執著。",
    "sanskrit": "色身: Rūpa-kāya",
    "lastCard": 49
  },
  {
    "firstCard": 50,
    "desc": "如來勿謂作是念「我當有所說法」。若人言如來有所說法即為謗佛，不能解佛所說。說法者無法可說，是名說法。",
    "sanskrit": "說法: Dharma-deśanā",
    "lastCard": 51
  },
  {
    "firstCard": 52,
    "desc": "須菩提白佛言：佛得無上正等正覺，為無所得耶？佛言：我於菩提乃至無有少法可得，是名阿耨多羅三藐三菩提。",
    "sanskrit": "少法: Alpa-dharma",
    "lastCard": 52
  },
  {
    "firstCard": 53,
    "desc": "是法平等，無有高下，是名菩提。以無我、無人、無眾生、無壽者，修一切善法，即得菩提。所言善法即非善法。",
    "sanskrit": "善法: Kuśala Dharma | 平等: Samatā",
    "lastCard": 53
  },
  {
    "firstCard": 54,
    "desc": "若以滿世界諸須彌山王等七寶聚布施，其福德亦不及受持讀誦此經乃至四句偈，並為他人演說之功德。",
    "sanskrit": "須彌山: Sumeru",
    "lastCard": 54
  },
  {
    "firstCard": 55,
    "desc": "如來勿作是念「我當度眾生」。實無有眾生如來度者，若有，如來即有我人眾生壽者四相。凡夫者，即非凡夫。",
    "sanskrit": "凡夫: Pṛthagjana | 度: Tāraṇa",
    "lastCard": 55
  },
  {
    "firstCard": 56,
    "desc": "若以三十二相觀如來，轉輪聖王即是如來。佛說經典名偈：「若以色見我，以音聲求我，是人行邪道，不能見如來。」",
    "sanskrit": "轉輪聖王: Cakravartin",
    "lastCard": 56
  },
  {
    "firstCard": 57,
    "desc": "發菩提心者，於法不說斷滅相。不可作是念：如來不以具足相故得菩提。般若中道不墮「常、斷」兩邊。",
    "sanskrit": "斷滅: Uccheda",
    "lastCard": 57
  },
  {
    "firstCard": 58,
    "desc": "參透無我、得成於忍的菩薩，功功德勝過寶施菩薩。因為菩薩不受福德，菩薩所作福德不應貪著，是故不受。",
    "sanskrit": "忍: Kṣānti | 貪著: Rága",
    "lastCard": 58
  },
  {
    "firstCard": 59,
    "desc": "若言如來若來若去若坐若臥，是不解佛說義。如來者，無所從來，亦無所去，故名如來（法身無處不在）。",
    "sanskrit": "去來: Gamanâgamana",
    "lastCard": 59
  },
  {
    "firstCard": 60,
    "desc": "三千大千世界碎為微塵，微塵眾非微塵眾，世界非世界。若世界實有，則是一合相，一合相即非一合相，不可貪著。",
    "sanskrit": "一合相: Piṇḍa-graha",
    "lastCard": 61
  },
  {
    "firstCard": 62,
    "desc": "若人言佛說我見人見眾生見壽者見，是不解佛意。發菩提心者，於一切法，應如是知、如是見、如是信解，不生法相。",
    "sanskrit": "法相: Dharma-saṃjñā | 知見: Jñāna-darśana",
    "lastCard": 63
  },
  {
    "firstCard": 64,
    "desc": "菩薩為人演說此經，應「不取於相，如如不動」。因為「一切有為法，如夢幻泡影，如露亦如電，應作如是觀。」",
    "sanskrit": "有為法: Saṃskṛta Dharma | 夢幻泡影: Svapna-māyā-bubbula-pratibhāsa",
    "lastCard": 65
  }
];
