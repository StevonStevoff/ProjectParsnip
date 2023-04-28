import * as Yup from 'yup';

const DeviceSchema = Yup.object().shape({
  name: Yup.string().required('Device name is required'),
  owner: Yup.number().required('Device owner is required'),
});

export default DeviceSchema;
