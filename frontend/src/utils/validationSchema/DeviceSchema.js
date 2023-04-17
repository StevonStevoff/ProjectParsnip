import * as Yup from 'yup';

const DeviceSchema = Yup.object().shape({
  name: Yup.string().required('Device name is required'),
});

export default DeviceSchema;
