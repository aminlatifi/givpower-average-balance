import 'antd/dist/antd.css';
import './App.css';
import { Button, Form, Input, InputNumber, Select, Tooltip, Typography, Drawer } from 'antd';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';

import { useState } from 'react';

import config from './config';
import { calculateAverage } from './lib/calculator';

function App() {
  const onFinish = (values: any) => {
    console.log('Success:', values);

    calculateAverage(
      values.env,
      values.walletAddress,
      Number(values.fromTimestamp),
      Number(values.toTimestamp),
    ).then(setResult);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  function replaceWithBr() {
    return result.replace(/\n/g, '<br />');
  }
  const [result, setResult] = useState('');

  const { Option } = Select;

  return (
    <div className='App'>
      <h1>Calculate average GIVpower</h1>

      <Form
        name='basic'
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 20 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label='Environment'
          name='env'
          rules={[{ required: true, message: 'Please select the env!' }]}
        >
          <Select style={{ width: '100%' }}>
            {Object.entries(config.environments).map(([key, e]) => {
              return (
                <Option key={key} value={e.subgraphUrl}>
                  {e.title}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label='Wallet Address'
          name='walletAddress'
          rules={[{ required: true, message: 'Please input Wallet Address!' }]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label='From Timestamp'
          name='fromTimestamp'
          rules={[
            {
              required: true,
              message: 'Please input timestamp (seconds) for the start of the period!',
            },
          ]}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <InputNumber style={{ width: '70%' }} prefix={<ClockCircleOutlined />} />
            <Tooltip title='Useful tool'>
              <Typography.Link href='https://www.epochconverter.com/'>Need Help?</Typography.Link>
            </Tooltip>
          </div>
        </Form.Item>

        <Form.Item
          label='To Timestamp'
          name='toTimestamp'
          rules={[
            {
              required: true,
              message: 'Please input timestamp (seconds) for the end of the period!',
            },
          ]}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <InputNumber style={{ width: '70%' }} prefix={<ClockCircleOutlined />} />
            <Tooltip title='Useful tool'>
              <Typography.Link href='https://www.epochconverter.com/'>Need Help?</Typography.Link>
            </Tooltip>
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>

      <p dangerouslySetInnerHTML={{__html: replaceWithBr()}} style={{textAlign: 'left'}}/>

    </div>
  );
}

export default App;
