declare module 'react-cytoscapejs' {
  import { ComponentType } from 'react';
  import type { Core, ElementDefinition, Stylesheet } from 'cytoscape';

  interface CytoscapeProps {
    elements: ElementDefinition[]; // ✔ Flat array
    style?: React.CSSProperties;
    layout?: any;
    stylesheet?: Stylesheet[];
    cy?: (cy: Core) => void;
  }

  const CytoscapeComponent: ComponentType<CytoscapeProps>;
  export default CytoscapeComponent;
}
