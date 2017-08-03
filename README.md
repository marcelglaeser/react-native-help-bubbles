# react-native-help-bubbles

Inspired by https://github.com/liuzheng644607/react-native-intro

# Install
Run ```npm install react-native-help-bubbles --save```

# Usage
```
import HelpBubbles, { helpbubbles } from 'react-native-help-bubbles';

<HelpBubbles group="firstStart" content={'I will help you!'} step={1}/>

.....

componentDidMount() {

    var helpbubbles = helpbubbles({group:'firstStart'});
    helpbubbles.start();

}

```

### Properties

#### Basic

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| showStepNum | true | `bool` | If `true`, the number tip will be shown. |
| stopBtnTitle | true | `string` | Props to translate the Stop button. |
| nextBtnTitle | 0 | `string` | Props to translate the Next button. |
| prevBtnTitle | false | `string` | Props to translate the Prev button. |

#### Custom basic style & content

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| customToolTipStyle | - | `style` | Tooltip style. |
| customArrowStyle | - | `style` | Arrow style. |

# Warning
 *This Component does not support your component Wrapped by `Redux connect` currently;*
