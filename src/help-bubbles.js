
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Animated
} from 'react-native'

import React, {
  cloneElement,
  Component
} from 'react'

import RootSiblings from 'react-native-root-siblings'

const { width, height } = Dimensions.get('window');
const [ CLIENT_WIDTH, CLIENT_HEIGHT ] = [ width, height ]
const DEFAULT_GROUP = 'DEFAULT_GROUP';
const DEFAULT_SHOWSTEPNUM = true;
const DEFAULT_STOPBTNTITLE = 'stop';
const DEFAULT_NEXTBTNTITLE = 'next';
const DEFAULT_PREVBTNTITLE = 'prev';

var sibling;
var groupMap = {};

export default class HelpBubbles extends Component {

  constructor (props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    }
  }

  setNativeProps(obj) {
    this._refHelpBubbles.setNativeProps(obj);
  }

  componentDidMount() {
    const { group, showStepNum, step, content, disable, customToolTipStyle, customArrowStyle, stopBtnTitle, nextBtnTitle, prevBtnTitle } = this.props;

    if (!groupMap[group || DEFAULT_GROUP]) {
      groupMap[group || DEFAULT_GROUP] = {};
    }

    let groupA = groupMap[group || DEFAULT_GROUP];

    if (!groupA[step]) {
      groupA[step] = {
        content,
        disable,
        customToolTipStyle,
        customArrowStyle,
        stopBtnTitle,
        nextBtnTitle,
        prevBtnTitle,
        target: this,
        refTarget: this._refHelpBubbles,
        _index: 0
      };
    } else {
      ++(groupA[step]._index);
    }
  }

measure() {
  this._refHelpBubbles.measure.apply(this._refHelpBubbles, arguments)
}

componentWillUnmount() {
  const { group, step, content, disable, customToolTipStyle, customArrowStyle, stopBtnTitle, nextBtnTitle, prevBtnTitle } = this.props;
  var groupA = groupMap[group || DEFAULT_GROUP][step];

  if (groupA._index > 0) {
    --groupA._index;
  } else {
    delete groupMap[group || DEFAULT_GROUP][step]
    if (Object.keys(groupMap[group || DEFAULT_GROUP]).length === 0) {
      delete groupMap[group && DEFAULT_GROUP];
    }
  }
}

render() { //TouchableOpacity
  this.html = (
    <View activeOpacity={1} {...this.props} ref={c => this._refHelpBubbles = c}>
    {this.props.children}
    </View>
  );
  return this.html
}
}

var hilightBox = null;
var refHilightBox;
var zIndex  = 99999;
var offsetW = 4;
var DEFAULTOPTIONS = {
  group: DEFAULT_GROUP,
  showStepNum: DEFAULT_SHOWSTEPNUM,
  stopBtnTitle: DEFAULT_STOPBTNTITLE,
  nextBtnTitle: DEFAULT_NEXTBTNTITLE,
  prevBtnTitle: DEFAULT_PREVBTNTITLE
};

export function helpbubbles(opts = {}) {
  opts = Object.assign({}, DEFAULTOPTIONS, opts);
  var group     = groupMap[opts.group];

  if (!group) return;

  var stepArr   = Object.keys(group).sort();
  var len       = stepArr.length;
  var index     = 0;
  var timer     = null;
  var stepTimer = null;
  var retn      = { start, stop };

  var refContainer;
  var target;
  var refTarget;
  var element;
  var refModal;

  /**
  * @return {[type]} [description]
  */
  function start() {
    if (!sibling) {
      sibling = new RootSiblings(
        <HelpBubblesModal
        ref={(c) => refModal = c}
        next={next}
        prev={prev}
        stop={stop}
        len={len}
        showStepNum={opts.showStepNum}
        stopBtnTitle={opts.stopBtnTitle}
        nextBtnTitle={opts.nextBtnTitle}
        prevBtnTitle={opts.prevBtnTitle}
        />
      );
    }

    clearTimeout(stepTimer);
    clearTimeout(timer);

    stepTimer = setTimeout(() => {
      toStep(index);
    });
  }

  /**
  * @return {[type]} [description]
  */
  function stop() {
    clearTimeout(stepTimer);
    clearTimeout(timer);
    sibling.destroy();
    sibling = null;
    index = 0;
  }

  /**
  * @return {Function} [description]
  */
  function next() {
    if (index >= len - 1) return;

    index++;
    toStep(index);
  }

  /**
  * @return {[type]} [description]
  */
  function prev() {
    if (index <= 0) return;

    index--;
    toStep(index);
  }

  /**
  * @return {[type]} [description]
  */
  function toStep(index) {
    var currentStep = group[stepArr[index]];
    var content = currentStep.content;
    var customToolTipStyle = currentStep.customToolTipStyle;
    var customArrowStyle = currentStep.customArrowStyle;
    var stopBtnTitle = currentStep.stopBtnTitle;
    var nextBtnTitle = currentStep.nextBtnTitle;
    var prevBtnTitle = currentStep.prevBtnTitle;
    target = currentStep.target;
    refTarget = currentStep.refTarget;

    element = target.html;
    /*element = cloneElement(element, {
    style: [element.props.style, {position: 'absolute',left: 0, top: 0}]
  });*/

  refModal.innerElement = null;
  refModal.forceUpdate();

  new Promise((resolve, reject) => {
    refTarget.measure((x, y, width, height, pageX, pageY) => {
      resolve({ x, y, width, height, pageX, pageY });
    }, () => reject);
  })
  .then((res) => {

    let obj = {
      width: res.width,
      height: res.height,
      left: res.pageX,
      top: res.pageY
    };
    // hide the tooltip
    refModal.toggleTooltip(false);

    timer = setTimeout(() => {
      refModal.innerElement = element;
      refModal.currentStep = index+1;
      refModal.content = typeof content === 'string' ? <View><Text style={styles.toolTipContent}>{content}</Text></View> : content;
      refModal.customToolTipStyle = customToolTipStyle;
      refModal.customArrowStyle = customArrowStyle;
      refModal.stopBtnTitle = stopBtnTitle;
      refModal.nextBtnTitle = nextBtnTitle;
      refModal.prevBtnTitle = prevBtnTitle;
      refModal.forceUpdate(() => {
        refModal.refContainer.setNativeProps({
          style: obj
        });
      });
      refModal.toggleTooltip(true);
    }, 300);

    refModal.animateMove({
      width: res.width + offsetW,
      height: res.height + offsetW,
      left: res.pageX - offsetW/2,
      top: res.pageY - offsetW/2
    })
  });

}

return retn;
}

class HelpBubblesModal extends Component {
  constructor(props) {
    super(props);

    this.innerElement = null;
    this.currentStep = 1;

    this._aniWidth = new Animated.Value(0);
    this._aniHeight = new Animated.Value(0);
    this._aniLeft = new Animated.Value(0);
    this._aniTop = new Animated.Value(0);

    this._aniOpacity = new Animated.Value(0);

    this._aniStepNumLeft = new Animated.Value(0);
  }

  componentWillMount() {
    Dimensions.addEventListener("change", this.onLayout);
  }

  componentWillUnmount() {
    // Important to stop updating state after unmount
    Dimensions.removeEventListener("change", this.onLayout);
  }

  onLayout(e) {
    /*this.animateMove({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    left: this.pageX - offsetW/2,
    top: this.pageY - offsetW/2
  })*/
/*  this.setState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  });
  */
  //this._refHelpBubbles.style.width = Dimensions.get('window').width;
  //alert(Dimensions.get('window').width);
  //this.props.refresh();
}

  animateMove(obj = {}) {
    var duration = 300;

    var stepNumLeft = obj.left - 12;

    if (stepNumLeft < 0) {
      stepNumLeft = obj.left + obj.width - 12;
      if (stepNumLeft > CLIENT_WIDTH - 24) {
        stepNumLeft = CLIENT_WIDTH - 24;
      }
    }

    Animated.parallel([
      Animated.timing(this._aniWidth, {
        duration,
        toValue: obj.width
      }),

      Animated.timing(this._aniHeight, {
        duration,
        toValue: obj.height
      }),

      Animated.timing(this._aniLeft, {
        duration,
        toValue: obj.left
      }),

      Animated.timing(this._aniTop, {
        duration,
        toValue: obj.top
      }),

      Animated.timing(this._aniStepNumLeft, {
        duration,
        toValue: stepNumLeft
      })
    ]).start();

    var centerPoint = {
      x: obj.left + obj.width/2,
      y: obj.top + obj.height/2
    };

    var relative2Left = centerPoint.x;
    var relative2Top = centerPoint.y;
    var relative2Bottom = Math.abs(centerPoint.y - CLIENT_HEIGHT);
    var relative2Right = Math.abs(centerPoint.x - CLIENT_WIDTH);


    var whereVerticalPlace = relative2Bottom > relative2Top ? 'bottom' : 'top';
    var whereHorizontalPlace = relative2Left > relative2Right ? 'left' : 'right';

    var margin = 13;
    var tooltip = {};
    var arrow = {};

    switch (whereVerticalPlace) {

      case 'bottom':
      tooltip.top = obj.top + obj.height + margin;
      arrow.borderBottomColor = '#58b1fc';
      arrow.top = tooltip.top - margin + 3;
      break;

      case 'top':
      tooltip.bottom = CLIENT_HEIGHT - obj.top + margin;
      arrow.borderTopColor = '#58b1fc';
      arrow.bottom = tooltip.bottom - margin + 3;
      break;
      default:
      // nothing todo
    }

    switch (whereHorizontalPlace) {

      case 'left':
      tooltip.right = Math.max(CLIENT_WIDTH - (obj.left + obj.width), 0);
      tooltip.right = tooltip.right === 0 ? tooltip.right + margin : tooltip.right;
      tooltip.maxWidth = CLIENT_WIDTH - tooltip.right;
      arrow.right = tooltip.right + margin;
      break;

      case 'right':
      tooltip.left = Math.max(obj.left, 0);//obj.width*0.33;
      tooltip.left = tooltip.left === 0 ? tooltip.left + margin : tooltip.left;
      //alert(obj.left + obj.width);
      tooltip.maxWidth = CLIENT_WIDTH - tooltip.left - margin;
      arrow.left = tooltip.left+ margin;//*1.5
      break;
      default:
      // nothing todo
    }

    this.tooltip = tooltip;
    this.arrow = arrow;
  }

  toggleTooltip(isShow = true) {
    Animated.timing(this._aniOpacity, {
      toValue: isShow ? 1 : 0,
      duration: 200
    }).start();
  }

  render() {
    return (
      <View style={[styles.container, {zIndex}]}>
      <Animated.View ref={(c) => this.refHilightBox = c}
      style={[styles.hilightBox, {position: 'absolute'}, {
        width: this._aniWidth,
        height: this._aniHeight,
        left: this._aniLeft,
        top: this._aniTop
      }]}>
      </Animated.View>
      <View ref={(c) => this.refContainer = c }
      style={[styles.modalContent]}
      />
      {this.props.showStepNum ?
        <Animated.View style={[styles.stepNum, {zIndex: zIndex+1000}, {
          left: this._aniStepNumLeft,
          top: Animated.add(this._aniTop, -12)
        }]}>
        <Text style={[styles.stepNumText]}>{this.currentStep}</Text>
        </Animated.View>
        : null
      }
      <Animated.View style={[styles.arrow, this.arrow, {opacity: this._aniOpacity}, this.customArrowStyle]}></Animated.View>
      <Animated.View style={[styles.toolTip, this.tooltip, {opacity: this._aniOpacity}, this.customToolTipStyle]}>
      <View style={{flex: 1}}>
      {this.content || null}
      </View>
      <View style={[styles.helpbubblesBar]}>
      <View>
      <View style={[styles.helpbubblesButton, {
        borderColor: '#fff',
        marginRight: 20,

      }]} onTouchStart={() => this.props.stop()}>
      <Text style={[styles.buttonText, {
        color: '#fff'
      }]}>{this.stopBtnTitle ? this.stopBtnTitle : this.props.stopBtnTitle}</Text>
      </View>
      </View>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
      {this.currentStep > 1 ?
        <View style={[styles.helpbubblesButton]} onTouchStart={() => this.props.prev()}>
        <Text style={[styles.buttonText]}>{this.prevBtnTitle ? this.prevBtnTitle : this.props.prevBtnTitle}</Text>
        </View>
        : null }
        {this.currentStep < this.props.len ?
          <View style={[styles.helpbubblesButton, {marginLeft: 8, alignSelf: 'flex-end'}]} onTouchStart={() => this.props.next()}>
          <Text style={[styles.buttonText]}>{this.nextBtnTitle ? this.nextBtnTitle : this.props.nextBtnTitle}</Text>
          </View>
          : null }
          </View>
          </View>
          </Animated.View>
          </View>
        );
      }
    }

    const styles = StyleSheet.create({
      container: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom:0
      },

      hilightBox: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderRadius: 1,
      },

      arrow: {
        position: 'absolute',
        borderColor: 'transparent',
        borderWidth: 5
      },

      up: {
        borderBottomColor: '#58b1fc'
      },

      down: {
        borderTopColor: '#58b1fc'
      },

      toolTipOuter: {
        position: 'absolute',
        minWidth: 180,
        maxWidth: 300
      },

      toolTip: {
        position: 'absolute',
        padding: 5,
        backgroundColor: "#58b1fc",
        borderRadius: 3,
        overflow: 'hidden'
      },

      toolTipContent: {
        fontWeight: 'bold',
        color: '#fff'
      },

      stepNum: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 12,
        borderColor: '#fff',
        backgroundColor: "#58b1fc",
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
      },

      stepNumText: {
        backgroundColor: 'rgba(255,255,255,0)',
        fontWeight: 'bold',
        color: '#fff'
      },

      sibling: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent'
      },

      helpbubblesBar: {
        marginTop: 15,
        flexDirection: 'row',
      },

      helpbubblesButton: {
        padding: 8,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 2
      },

      buttonText: {
        fontSize: 12,
        textAlign: 'center',
        color: '#fff'
      },

      modalContent: {
        position: 'absolute',
        overflow: 'hidden'
      },

      modal: {
        backgroundColor: 'rgba(0,0,0,0.5)',
      }
    });
