require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-paste-input"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "15.1" }
  s.source       = { :git => "https://github.com/mattermost/react-native-paste-input.git", :tag => "#{s.version}" }
  s.swift_version = '5.0'

  s.source_files = "ios/**/*.{h,m,mm,swift,cpp}"

  # React Native 0.82+ is New Architecture only and no longer sets RCT_NEW_ARCH_ENABLED, so refuse
  # only when an app has explicitly turned it off.
  if ENV['RCT_NEW_ARCH_ENABLED'] == '0'
    raise Pod::Informative, "react-native-paste-input #{package["version"]} requires the React Native New Architecture (Fabric/TurboModules)."
  end

  # Fabric only - always include codegen specs
  install_modules_dependencies(s)
end
