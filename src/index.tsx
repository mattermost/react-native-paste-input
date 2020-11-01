import { NativeModules } from 'react-native';

type PasteInputType = {
  multiply(a: number, b: number): Promise<number>;
};

const { PasteInput } = NativeModules;

export default PasteInput as PasteInputType;
