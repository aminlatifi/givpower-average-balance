import './App.css';
import { Button, Form, Input } from 'antd';

function App() {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className='App'>
      <h1>Calculate average GIVpower</h1>

      <Form
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label='Wallet Address'
          name='walletAddress'
          rules={[{ required: true, message: 'Please input Wallet Address!' }]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label='From Timestamp (seconds)'
          name='fromTimestamp'
          rules={[
            { required: true, message: 'Please input timestamp (seconds) for the start of the period!' },
          ]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label='To Timestamp (seconds)'
          name='toTimestamp'
          rules={[
            { required: true, message: 'Please input timestamp (seconds) for the end of the period!' },
          ]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default App;
