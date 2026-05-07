#pragma once

#include <react/renderer/components/PasteTextInputSpecs/ShadowNodes.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <react/renderer/textlayoutmanager/TextLayoutManager.h>

namespace facebook::react {

// Full class definition must live in the header because autolinking.cpp passes
// this type to concreteComponentDescriptorProvider<T>(), which requires a
// complete type. The adopt() override injects TextLayoutManager so that
// measureContent() can perform text measurement for multiline auto-resize.
class PasteTextInputComponentDescriptor final
    : public ConcreteComponentDescriptor<PasteTextInputShadowNode> {
 public:
  PasteTextInputComponentDescriptor(const ComponentDescriptorParameters& parameters)
      : ConcreteComponentDescriptor<PasteTextInputShadowNode>(parameters),
        textLayoutManager_(
            std::make_shared<TextLayoutManager>(contextContainer_)) {}

 protected:
  void adopt(ShadowNode& shadowNode) const override {
    auto& textInputShadowNode =
        static_cast<PasteTextInputShadowNode&>(shadowNode);
    textInputShadowNode.setTextLayoutManager(textLayoutManager_);
    textInputShadowNode.dirtyLayout();
    ConcreteComponentDescriptor::adopt(shadowNode);
  }

 private:
  std::shared_ptr<const TextLayoutManager> textLayoutManager_;
};

void PasteTextInputSpecs_registerComponentDescriptorsFromCodegen(
  std::shared_ptr<const ComponentDescriptorProviderRegistry> registry);

} // namespace facebook::react
