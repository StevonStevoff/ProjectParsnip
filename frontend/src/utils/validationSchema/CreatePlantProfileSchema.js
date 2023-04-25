import * as Yup from 'yup';

const CreatePlantProfileSchema = (selectedTypes) => Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  plant_type_id: Yup.number().required('Plant type is required'),
  grow_duration: Yup.number().required('Grow Duration is required'),
  public: Yup.boolean().required('Public status is required'),
  properties: Yup.object().shape(
    selectedTypes.reduce((schema, property) => ({
      ...schema,
      [property]: Yup.object().shape({
        min: Yup.number()
          .typeError(`${property} minimum value must be a number`)
          .required(`${property} minimum value is required`),
        max: Yup.number()
          .typeError(`${property} maximum value must be a number`)
          .required(`${property} maximum value is required`)
          .min(
            Yup.ref('min'),
            `${property} maximum value must be greater than or equal to the minimum value`,
          ),
      }),
    }), {}),
  ),
});

export default CreatePlantProfileSchema;
