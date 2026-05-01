#include "ComponentDescriptors.h"

namespace facebook::react {

void PasteTextInputSpecs_registerComponentDescriptorsFromCodegen(
    std::shared_ptr<const ComponentDescriptorProviderRegistry> registry) {
  registry->add(
      concreteComponentDescriptorProvider<PasteTextInputComponentDescriptor>());
}

} // namespace facebook::react
