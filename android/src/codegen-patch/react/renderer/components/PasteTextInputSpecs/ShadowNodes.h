#pragma once

#include <react/renderer/components/androidtextinput/AndroidTextInputEventEmitter.h>
#include <react/renderer/components/androidtextinput/AndroidTextInputProps.h>
#include <react/renderer/components/androidtextinput/AndroidTextInputState.h>
#include <react/renderer/attributedstring/AttributedString.h>
#include <react/renderer/components/text/BaseTextShadowNode.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/textlayoutmanager/TextLayoutManager.h>
#include <react/utils/ContextContainer.h>
#include <jsi/jsi.h>

namespace facebook::react {

JSI_EXPORT extern const char PasteTextInputComponentName[];

class PasteTextInputShadowNode final
    : public ConcreteViewShadowNode<
          PasteTextInputComponentName,
          AndroidTextInputProps,
          AndroidTextInputEventEmitter,
          AndroidTextInputState>,
      public BaseTextShadowNode {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::LeafYogaNode);
    traits.set(ShadowNodeTraits::Trait::MeasurableYogaNode);
    traits.set(ShadowNodeTraits::Trait::BaselineYogaNode);
    return traits;
  }

  void setTextLayoutManager(
      std::shared_ptr<const TextLayoutManager> textLayoutManager);

 protected:
  Size measureContent(
      const LayoutContext& layoutContext,
      const LayoutConstraints& layoutConstraints) const override;

  void layout(LayoutContext layoutContext) override;

  Float baseline(const LayoutContext& layoutContext, Size size) const override;

  LayoutConstraints getTextConstraints(
      const LayoutConstraints& layoutConstraints) const;

 private:
  void updateStateIfNeeded(const LayoutContext& layoutContext);

  AttributedString getAttributedString(
      const LayoutContext& layoutContext) const;

  AttributedString getMostRecentAttributedString(
      const LayoutContext& layoutContext) const;

  AttributedString getPlaceholderAttributedString(
      const LayoutContext& layoutContext) const;

  std::shared_ptr<const TextLayoutManager> textLayoutManager_;
};

} // namespace facebook::react
