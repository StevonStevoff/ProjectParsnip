# Running the frontend

1. Open the frontend directory 
2. Run `npm install`
3. Confirm the peer dependencies apply to jest and the react native testing library 
4. Run `npm install --legacy-peer-deps`
5. Run `npm start` 
6.  Follow the expo instructions to run the app on different devices 
7. Ensure that the API URL for the backend is correct for android devices.
    * Check the android virtual device IP address in the console 
    * Open the [axiosConfigs.js](./api/config/axiosConfigs.js) file and change the androidDevUrl variable to match your android device IP Address 


## Running with android 
1. Download android studio 
2. Setup virtual device manager with android studio 
3. Open a virtual android device
4. Run the app following the above steps 
5. Link the app to the android device using expo 

## Running with IOS
*Note: Only works on mac*
1. Install XCode
2. Run a virtual device on simulator 
3. Run the app following the above steps 
4. Link the app to the android device using expo 

## Running on Your Own mobile device 
1. Download the expo app on your mobile device
2. Run both the backend and frontend on the same network as your mobile device
3. Connect the expo app to your terminal following the expo command-line directions. 
