import React from 'react';
import { Text, IconButton, Heading } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Col, Row, Grid } from 'react-native-easy-grid';

function Table() {
  return (
    <Grid style={{ width: '100%' }}>
      <Row style={{
        height: '10%',
        minHeight: '10%',
      }}
      >
        <Col style={{
          width: '40%',
          minWidth: '40%',
        }}
        >
          <Text>Name</Text>
        </Col>
        <Col style={{
          width: '40%',
          minWidth: '40%',
        }}
        >
          <Heading size="lg">Plant Types</Heading>
        </Col>
        <Col style={{ width: '20%', minWidth: '20%' }} />
      </Row>
      <Row>
        <Col style={{
          width: '40%',
          minWidth: '40%',
        }}
        >
          <Text>Brown Cactus</Text>
        </Col>
        <Col style={{
          width: '40%',
          minWidth: '40%',
        }}
        >
          <Text>Cactus</Text>
        </Col>
        <Col style={{
          flexDirection: 'row', justifyContent: 'space-evenly', width: '20%', minWidth: '20%',
        }}
        >
          <IconButton as={MaterialCommunityIcons} name="content-copy" size="lg" />

        </Col>
      </Row>
    </Grid>
  );
}

export default Table;
