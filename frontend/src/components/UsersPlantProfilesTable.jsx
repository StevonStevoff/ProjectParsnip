import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { useTheme } from '@react-navigation/native';

function Table() {
  const { colors } = useTheme();
  return (
    <Grid style={{ width: '100%' }}>
      <Row style={colors.plantProfileRow}>
        <Col style={colors.plantProfileCol}>
          <Text style={colors.plantProfileHeadingText}>Name</Text>
        </Col>
        <Col style={colors.plantProfileCol}>
          <Text style={colors.plantProfileHeadingText}>Plant Types</Text>
        </Col>
        <Col style={{ width: '20%', minWidth: '20%' }} />
      </Row>
      <Row>
        <Col style={colors.plantProfileCol}>
          <Text style={colors.plantProfileText}>Brown Cactus</Text>
        </Col>
        <Col style={colors.plantProfileCol}>
          <Text style={colors.plantProfileText}>Cactus</Text>
        </Col>
        <Col style={{
          flexDirection: 'row', justifyContent: 'space-evenly', width: '20%', minWidth: '20%',
        }}
        >
          <TouchableOpacity>
            <MaterialCommunityIcons name="pencil-outline" size={24} color={colors.dark ? 'white' : 'black'} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="content-copy" size={24} color={colors.dark ? 'white' : 'black'} />
          </TouchableOpacity>

        </Col>
      </Row>
    </Grid>
  );
}

export default Table;
