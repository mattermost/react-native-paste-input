#include "ShadowNodes.h"

#include <react/featureflags/ReactNativeFeatureFlags.h>
#include <react/renderer/attributedstring/AttributedStringBox.h>
#include <react/renderer/attributedstring/TextAttributes.h>
#include <react/renderer/components/text/BaseTextShadowNode.h>
#include <react/renderer/core/LayoutConstraints.h>
#include <react/renderer/core/LayoutContext.h>
#include <react/renderer/core/conversions.h>
#include <react/renderer/textlayoutmanager/TextLayoutContext.h>

namespace facebook::react {

extern const char PasteTextInputComponentName[] = "PasteTextInput";

void PasteTextInputShadowNode::setTextLayoutManager(
    std::shared_ptr<const TextLayoutManager> textLayoutManager) {
  ensureUnsealed();
  textLayoutManager_ = std::move(textLayoutManager);
}

Size PasteTextInputShadowNode::measureContent(
    const LayoutContext& layoutContext,
    const LayoutConstraints& layoutConstraints) const {
  if (!textLayoutManager_) {
    return {};
  }

  auto textConstraints = getTextConstraints(layoutConstraints);

  TextLayoutContext textLayoutContext{
      .pointScaleFactor = layoutContext.pointScaleFactor,
      .surfaceId = getSurfaceId(),
  };

  if (getStateData().cachedAttributedStringId != 0) {
    auto textSize = textLayoutManager_
                        ->measureCachedSpannableById(
                            getStateData().cachedAttributedStringId,
                            getConcreteProps().paragraphAttributes,
                            textLayoutContext,
                            textConstraints)
                        .size;
    return layoutConstraints.clamp(textSize);
  }

  AttributedString attributedString = getMostRecentAttributedString(layoutContext);
  if (attributedString.isEmpty()) {
    attributedString = getPlaceholderAttributedString(layoutContext);
  }

  auto textSize = textLayoutManager_
                      ->measure(
                          AttributedStringBox{attributedString},
                          getConcreteProps().paragraphAttributes,
                          textLayoutContext,
                          textConstraints)
                      .size;
  return layoutConstraints.clamp(textSize);
}

void PasteTextInputShadowNode::layout(LayoutContext layoutContext) {
  if (textLayoutManager_) {
    updateStateIfNeeded(layoutContext);
  }
  ConcreteViewShadowNode::layout(layoutContext);
}

Float PasteTextInputShadowNode::baseline(
    const LayoutContext& layoutContext,
    Size size) const {
  if (!textLayoutManager_) {
    return 0;
  }

  AttributedString attributedString = getMostRecentAttributedString(layoutContext);
  if (attributedString.isEmpty()) {
    attributedString = getPlaceholderAttributedString(layoutContext);
  }

  auto top = YGNodeLayoutGetBorder(&yogaNode_, YGEdgeTop) +
      YGNodeLayoutGetPadding(&yogaNode_, YGEdgeTop);

  AttributedStringBox attributedStringBox{attributedString};
  return LineMeasurement::baseline(textLayoutManager_->measureLines(
             attributedStringBox,
             getConcreteProps().paragraphAttributes,
             size)) +
      top;
}

LayoutConstraints PasteTextInputShadowNode::getTextConstraints(
    const LayoutConstraints& layoutConstraints) const {
  if (getConcreteProps().multiline) {
    return layoutConstraints;
  }
  return LayoutConstraints{
      .minimumSize = layoutConstraints.minimumSize,
      .maximumSize = Size{
          .width = std::numeric_limits<Float>::infinity(),
          .height = layoutConstraints.maximumSize.height,
      },
      .layoutDirection = layoutConstraints.layoutDirection,
  };
}

void PasteTextInputShadowNode::updateStateIfNeeded(
    const LayoutContext& layoutContext) {
  ensureUnsealed();
  const auto& stateData = getStateData();
  auto reactTreeAttributedString = getAttributedString(layoutContext);

  if (stateData.reactTreeAttributedString == reactTreeAttributedString) {
    return;
  }

  const auto& props = BaseShadowNode::getConcreteProps();
  if (props.mostRecentEventCount < stateData.mostRecentEventCount) {
    return;
  }

  auto newEventCount = stateData.reactTreeAttributedString.isContentEqual(
                           reactTreeAttributedString)
      ? 0
      : props.mostRecentEventCount;
  auto newAttributedString = getMostRecentAttributedString(layoutContext);

  setStateData(
      AndroidTextInputState{
          AttributedStringBox(newAttributedString),
          reactTreeAttributedString,
          props.paragraphAttributes,
          newEventCount});
}

AttributedString PasteTextInputShadowNode::getAttributedString(
    const LayoutContext& layoutContext) const {
  auto childTextAttributes = TextAttributes::defaultTextAttributes();
  childTextAttributes.fontSizeMultiplier = layoutContext.fontSizeMultiplier;
  childTextAttributes.apply(getConcreteProps().textAttributes);
  childTextAttributes.backgroundColor = HostPlatformColor::UndefinedColor;

  auto attributedString = AttributedString{};
  auto attachments = BaseTextShadowNode::Attachments{};
  BaseTextShadowNode::buildAttributedString(
      childTextAttributes, *this, attributedString, attachments);
  attributedString.setBaseTextAttributes(childTextAttributes);

  if (!getConcreteProps().text.empty()) {
    auto textAttributes = TextAttributes::defaultTextAttributes();
    textAttributes.apply(getConcreteProps().textAttributes);
    textAttributes.fontSizeMultiplier = layoutContext.fontSizeMultiplier;
    auto fragment = AttributedString::Fragment{};
    fragment.string = getConcreteProps().text;
    fragment.textAttributes = textAttributes;
    fragment.textAttributes.backgroundColor = clearColor();
    fragment.parentShadowView = ShadowView(*this);
    attributedString.prependFragment(std::move(fragment));
  }

  return attributedString;
}

AttributedString PasteTextInputShadowNode::getMostRecentAttributedString(
    const LayoutContext& layoutContext) const {
  const auto& state = getStateData();
  auto reactTreeAttributedString = getAttributedString(layoutContext);

  bool treeAttributedStringChanged =
      !state.reactTreeAttributedString.compareTextAttributesWithoutFrame(
          reactTreeAttributedString);

  return (!treeAttributedStringChanged ? state.attributedStringBox.getValue()
                                       : reactTreeAttributedString);
}

AttributedString PasteTextInputShadowNode::getPlaceholderAttributedString(
    const LayoutContext& layoutContext) const {
  const auto& props = BaseShadowNode::getConcreteProps();

  AttributedString attributedString;
  attributedString.setBaseTextAttributes(
      props.getEffectiveTextAttributes(layoutContext.fontSizeMultiplier));

  if (!props.placeholder.empty()) {
    attributedString.appendFragment(
        {.string = props.placeholder,
         .textAttributes = attributedString.getBaseTextAttributes(),
         .parentShadowView = {}});
  }
  return attributedString;
}

} // namespace facebook::react
