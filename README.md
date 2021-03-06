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
| stopBtnTitle | stop | `string` | Props to translate the Stop button. |
| nextBtnTitle | next | `string` | Props to translate the Next button. |
| prevBtnTitle | prev | `string` | Props to translate the Prev button. |
| checkDisableEvent | - | `fnc` | Function to check if this bubble disabled. (Has the user seen this bubble before? (Need your own implemention.)) |
| willViewEvent | - | `fnc` | Function will called before the bubble appeared. |
| didViewEvent | - | `fnc` | Function will called after the bubble appeared. |
| cancelEvent | - | `fnc` | Function will called if the user canceled the bubbles. |

#### Custom basic style & content

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| customToolTipStyle | - | `style` | Tooltip style. |
| customArrowStyle | - | `style` | Arrow style. |

# Warning
 *This Component does not support your component Wrapped by `Redux connect` currently;*
