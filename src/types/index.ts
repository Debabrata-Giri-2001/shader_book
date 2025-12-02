import * as THREE from "three";
import * as Tweakpane from "tweakpane";

export type TweakpaneInstance = Tweakpane.Pane & {
  addBinding: Function;
  refresh: Function;
};

export interface ShaderItem {
  name: string;
  fragmentShader: string;
  vertexShader: string;
  geometryType: "Plane" | "Sphere" | "Box" | "Torus";
  uniforms: { [key: string]: THREE.IUniform<any> };
  setupControls: (
    pane: TweakpaneInstance,
    uniforms: { [key: string]: THREE.IUniform<any> }
  ) => void;
  imageUrl?: string;
  transparent?: boolean;
}
