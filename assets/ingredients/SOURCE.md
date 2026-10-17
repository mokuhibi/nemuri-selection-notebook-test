# 食材アイコン

作者：ちゃんりわ。配布元：https://github.com/nitoyon/pokesleep-tool
固定版：`11ebec8de7b7803e5d095e4f32ee29f6bc7db2fb`（2026-10-17T08:41:12Z）。取得・確認：2026-10-17。
ライセンス：MIT。17種類は Copyright (c) 2024 ちゃんりわ、Pumpkin / Avocado は Copyright (c) 2025 ちゃんりわ。各SVGの著作権表示・MIT全文を保持。
変更：React/MUIのラッパーを除去し、SVG図形を抽出。JSX属性をSVG属性へ変換。図形・配色・viewBoxは維持。
性能値・登録データとは独立した表示用ID対応。Soybeanは上流のsoy/SoyIcon（ワカクサ大豆）へ対応。

| 食材ID | 配布ファイル | 上流ファイル | 著作権年 | 変換後SHA-256 |
|---|---|---|---|---|
| `Apple` | `Apple.svg` | `src/ui/Resources/AppleIcon.tsx` | 2024 | `7b949c2dc80deab83a0d498d14b5621a0ace8a8e43ecbddd1127ca4d4417565c` |
| `Milk` | `Milk.svg` | `src/ui/Resources/MilkIcon.tsx` | 2024 | `6c977bbddc1ba832a271b99e1a26402fad26c461da021ae441a95917192d1b0e` |
| `Soybean` | `Soybean.svg` | `src/ui/Resources/SoyIcon.tsx` | 2024 | `22447b180b4a881a2aa2b95b486f11e5c888cc0dce45a212ad859484751e1122` |
| `Honey` | `Honey.svg` | `src/ui/Resources/HoneyIcon.tsx` | 2024 | `2f57630b1220bf904b8dd0771b674dc16f865dacf99b7c6ec2573ba6896f422d` |
| `Sausage` | `Sausage.svg` | `src/ui/Resources/SausageIcon.tsx` | 2024 | `d515112b9693eb4cf6d6d0abc335cbe52e1bddf6f3a4846943dfab161fc1bf69` |
| `Ginger` | `Ginger.svg` | `src/ui/Resources/GingerIcon.tsx` | 2024 | `df0ee749233b7b21c8d9fe719e9c59899884b8db5cd6745cca8ff6674fbfe0ab` |
| `Tomato` | `Tomato.svg` | `src/ui/Resources/TomatoIcon.tsx` | 2024 | `38c190a46db04e0024762133b37cbfab8d74d3c3e689a698980d3544dc015904` |
| `Egg` | `Egg.svg` | `src/ui/Resources/EggIcon.tsx` | 2024 | `bb7fbd051f19310d5d20d590dc907959633fa0bad778ea2a6b15c95a06ab3346` |
| `Oil` | `Oil.svg` | `src/ui/Resources/OilIcon.tsx` | 2024 | `379e5c8eb8ae45920b5029ea4362df370e5a5bcbab11020ae7bd122123037edb` |
| `Potato` | `Potato.svg` | `src/ui/Resources/PotatoIcon.tsx` | 2024 | `7109d842f646f8b083739ad081613304d1e72c4d510ae33b5690e55175486017` |
| `Herb` | `Herb.svg` | `src/ui/Resources/HerbIcon.tsx` | 2024 | `638ac29d05161b3cba6dc6833ebe9da926d883bbb2db851ed6a8608467e9a3f9` |
| `Corn` | `Corn.svg` | `src/ui/Resources/CornIcon.tsx` | 2024 | `f9a11f3b93222dd3d5bb263814b9e9480cae784d468a17f5b65475dac39b4c43` |
| `Cacao` | `Cacao.svg` | `src/ui/Resources/CacaoIcon.tsx` | 2024 | `385a36ea81f089331485ac106107cfd2648353bd1a918a861db578b769889acf` |
| `Coffee` | `Coffee.svg` | `src/ui/Resources/CoffeeIcon.tsx` | 2024 | `4583ba0a24396a39ee91f1e84205fbb70c1ccc41c13a44f7b3ab234eae25b8c4` |
| `Avocado` | `Avocado.svg` | `src/ui/Resources/AvocadoIcon.tsx` | 2025 | `054ff31dcdce5d27bcb3822b21013b8dde281a04a0ca060b7cf02ea0ed3510cc` |
| `Mushroom` | `Mushroom.svg` | `src/ui/Resources/MushroomIcon.tsx` | 2024 | `edc8a0098dd48ff0489038ae8e1d82f0c2600856d4ad72be35aa832d1c6eaaac` |
| `Leek` | `Leek.svg` | `src/ui/Resources/LeekIcon.tsx` | 2024 | `7ea665bfd84cebcb6367b1dc9957a7bc07910dc336fe44401c8ce90699955791` |
| `Pumpkin` | `Pumpkin.svg` | `src/ui/Resources/PumpkinIcon.tsx` | 2025 | `b8326fae620b25d8470c0648a9efda4066cc0b48ebff0fce98866f9d22ba8cc0` |
| `Tail` | `Tail.svg` | `src/ui/Resources/TailIcon.tsx` | 2024 | `60962b4b99445890d52866b06a92ee95870f2a54ab778f63c4bd08c6400a2011` |

## 変換修正（2026-10-17）

Pumpkin / Avocado の `<g>` 内の図形を正しく抽出。Reactの未展開参照タグを除去し、数値のJSX属性をSVG属性へ変換。元のtransform・座標・色・MIT全文を維持。読み込み成功だけでなく実図形を検証する。その他17ファイル・ID対応・不透明度・計算・保存形式は変更なし。
