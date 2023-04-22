import * as yup from 'yup';

const CreatePlantProfileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  plant_type_id: yup.number().required('Plant type ID is required'),
  grow_duration: yup.number().required('Grow Duration is required'),
  public: yup.boolean().required('Public status is required'),
});

export default CreatePlantProfileSchema;
