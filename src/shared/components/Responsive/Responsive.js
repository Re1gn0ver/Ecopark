
import { Dimensions } from 'react-native';
const scrHeight = Dimensions.get("screen").height
const scrWidth = Dimensions.get("screen").width
function getHeight(abHeight) {
    if (abHeight === undefined)
        return scrHeight
    return abHeight / 812 * scrHeight;
}
function getWidth(abWidth) {
    if (abWidth === undefined)
        return scrWidth;
    return abWidth / 375 * scrWidth;
}


export { getHeight, getWidth }