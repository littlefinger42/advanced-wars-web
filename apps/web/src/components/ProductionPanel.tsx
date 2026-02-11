import { getUnitDefinition, getUnitsProducibleAt } from "game-engine";
import { Card, Button, Typography, Space, Flex } from "antd";

interface ProductionPanelProps {
  propertyType: string;
  x: number;
  y: number;
  funds: number;
  onProduce: (unitType: string) => void;
}

export default function ProductionPanel({
  propertyType,
  funds,
  onProduce,
}: ProductionPanelProps) {
  const unitTypes = getUnitsProducibleAt(propertyType);

  return (
    <Card title="Produce Unit" style={{ width: "300px" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {unitTypes.map((type) => {
          const def = getUnitDefinition(type);
          if (!def) return null;
          const canAfford = funds >= def.cost;
          return (
            <Button
              key={type}
              block
              size="large"
              disabled={!canAfford}
              onClick={() => canAfford && onProduce(type)}
            >
              <Flex justify="space-between" style={{ width: "100%" }}>
                <span>{def.name}</span>
                <span>${def.cost}</span>
              </Flex>
            </Button>
          );
        })}
      </Space>
      <Typography.Text
        strong
        style={{
          display: "block",
          marginTop: 16,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Funds: ${funds}
      </Typography.Text>
    </Card>
  );
}
