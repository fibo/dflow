export const onChangeView = ({ Dflow, dflow, flowView, nodeDefinitions }) => {
  const catalog = dflow.nodesCatalog;

  return ({ action, data }) => {
    switch (action) {
      case "CREATE_NODE": {
        const nodeId = data.id;
        const view = flowView.node(nodeId);

        if (nodeLabels.includes(label)) {
          // Create node on dflow
          dflow.newNode({
            kind: label,
            id: nodeId,
            inputs: data.ins,
            outputs: data.outs,
          });

          // Complete node view with inputs and outputs.
          const NodeClass = catalog[label];

          const { inputs = [], outputs = [] } = NodeClass;

          for (let i = 0; i < inputs.length; i++) {
            const name = inputs[i].name;

            if (!view.inputs[i]) {
              view.newInput({});
            }

            if (typeof name === "string") {
              view.inputs[i].name = name;
              view.inputs[i].text = name;
            }
          }

          for (let i = 0; i < outputs.length; i++) {
            const name = outputs[i].name;

            if (!view.outputs[i]) {
              view.newOutput({});
            }

            if (typeof name === "string") {
              view.outputs[i].name = name;
              view.outputs[i].text = name;
            }
          }
        } else {
          try {
            const maybeJson = JSON.parse(label);

            if (view.outputs.length === 0) {
              view.newOutput({});
            }

            if (Dflow.isDflowData(maybeJson)) {
              dflow.newNode({
                id: nodeId,
                kind: catalog.data.kind,
                outputs: [
                  {
                    data: maybeJson,
                    id: data.outputs?.[0]?.id,
                  },
                ],
              });
            }
          } catch (error) {
            console.error(error);
          }
        }

        break;
      }

      case "CREATE_EDGE": {
        const {
          id,
          from: [sourceNodeId, sourcePinId],
          to: [targetNodeId, targetPinId],
        } = data;

        dflow.newEdge({
          id,
          source: [sourceNodeId, sourcePinId],
          target: [targetNodeId, targetPinId],
        });

        break;
      }

      default: {
        console.log(action, data);
      }
    }
  };
};
