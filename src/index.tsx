import { NativeModules } from 'react-native';

type ReactNativePasteInputType = {
  multiply(a: number, b: number): Promise<number>;
};

const { ReactNativePasteInput } = NativeModules;

export default ReactNativePasteInput as ReactNativePasteInputType;
