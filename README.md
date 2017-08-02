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

# Warning
 *This Component does not support your component Wrapped by `Redux connect` currently;*
