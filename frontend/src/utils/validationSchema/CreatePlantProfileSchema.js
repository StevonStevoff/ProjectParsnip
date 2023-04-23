import * as Yup from 'yup';

// const CreatePlantProfileSchema = yup.object().shape({
//   name: yup.string().required('Name is required'),
//   description: yup.string().required('Description is required'),
//   plant_type_id: yup.number().required('Plant type is required'),
//   grow_duration: yup.number().required('Grow Duration is required'),
//   min: yup.number().required('Minimum is required'),
//   max: yup.number().required('Maximum is required'),
//   min1: yup.number().required('Minimum is required'),
//   max1: yup.number().required('Maximum is required'),
//   min2: yup.number().required('Minimum is required'),
//   max2: yup.number().required('Maximum is required'),
//   min3: yup.number().required('Minimum is required'),
//   max3: yup.number().required('Maximum is required'),
//   public: yup.boolean().required('Public status is required'),
// });

// export default CreatePlantProfileSchema;

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
          .required(`${property} maximum value is required`),
      }),
    }), {}),
  ),
});

export default CreatePlantProfileSchema;
