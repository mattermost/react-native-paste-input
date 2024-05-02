require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-paste-input"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "12.4" }
  s.source       = { :git => "https://github.com/mattermost/react-native-paste-input.git", :tag => "#{s.version}" }
  s.swift_version = '5.0'

  
  s.source_files = "ios/**/*.{h,m,mm,swift,cpp}"

  if ENV["RCT_NEW_ARCH_ENABLED"] == nil || ENV["RCT_NEW_ARCH_ENABLED"] != "1"
    s.exclude_files = "ios/PasteTextInputSpecs"
  end

  install_modules_dependencies(s)
end
