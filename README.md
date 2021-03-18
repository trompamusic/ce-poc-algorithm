# ce-poc-algorithm

Welcome to the ce-poc-algorithm repository!

## Quick Start

1. Make sure you have Node.js and Yarn installed on your local machine
2. Make sure you are running the [CE API](https://github.com/trompamusic/ce-api) on your local machine.
3. Prepare the CE API with the initial data set by running all GraphQL queries in the `Initial data` section.
4. Update the `.env` files in the `./services/algorithm` and `./services/frontend` directories
5. Run the following command to start the containers `$ yarn start`

## Algorithm container

The algorithm container starts a Node.js script which subscribes to changes in the CE API.

## Frontend container

The frontend container is a `Create React App` application which visualises all ControlActions in the CE API and allows you to request new ControlActions with the required PropertyValues.

Visit the UI by navigating to http://localhost:3000.

## Initial data

Run the following queries in your [GraphiQL environment](http://localhost:4000/playground).

### Create a SoftwareApplication

```
mutation {
  CreateSoftwareApplication (
    identifier: "ffb473fe-b345-4f10-8fee-424ef13f6686"
    contributor: "https://www.verovio.org"
    title: "Verovio MusicXML Converter"
    name: "Verovio MusicXML Converter"
    creator: "Verovio"
    description: "Verovio supports conversion from MusicXML to MEI. When converting from this web interface, the resulting MEI data will be displayed directly in the MEI-Viewer. The MEI file can be saved through the MEI  button that will be displayed on the top right."
  	source: "https://github.com/rism-ch/verovio"
    subject: "Music notation engraving library for MEI with MusicXML,Humdrum support, toolkits, JavaScript, Python"
    format: "html"
    language: en
  ) {
    identifier
  }
}
```

### Create a EntryPoint

```
mutation {
  CreateEntryPoint(
    identifier: "d7a3b614-4c40-413f-99d6-c0da2c844963"
    contributor: "https://www.verovio.org"
    title: "Verovio MusicXML Converter"
    name: "Verovio MusicXML Converter"
    creator: "Verovio"
    description: "Verovio supports conversion from MusicXML to MEI. When converting from this web interface, the resulting MEI data will be displayed directly in the MEI-Viewer. The MEI file can be saved through the MEI  button that will be displayed on the top right."
    source: "https://github.com/rism-ch/verovio"
    subject: "Music notation engraving library for MEI with MusicXML,Humdrum support, toolkits, JavaScript, Python"
    format: "html"
    language: en
    actionPlatform: "TROMPA Algorithm Proof-Of-Concept"
    contentType: ["json"]
    encodingType: ["text"]
  ) {
    identifier
  }
}
```

### Link the SoftwareApplication to the EntryPoint

```
mutation {
  AddEntryPointActionApplication (
    from: { identifier: "d7a3b614-4c40-413f-99d6-c0da2c844963" }
    to: { identifier: "ffb473fe-b345-4f10-8fee-424ef13f6686" }
  ) {
    from {
      identifier
      name
    }
    to {
      identifier
      name
    }
  }
}
```

### Create a ControlAction template

```
mutation {
  CreateControlAction (
    identifier: "78d613b0-1064-4e9c-8f56-9c424d12bad9"
    description: "MusicXML to MEI conversion"
    name: "MusicXML to MEI conversion"
    actionStatus: PotentialActionStatus
  ) {
    identifier
    description
    actionStatus
  }
}
```

### Link the ControlAction template to the EntryPoint

```
mutation {
    AddEntryPointPotentialAction (
        from: { identifier: "d7a3b614-4c40-413f-99d6-c0da2c844963" }
    to: { identifier: "78d613b0-1064-4e9c-8f56-9c424d12bad9" }
    ) { 
        from {
            identifier
        }
        to {
            identifier
        }
    }
}
```

### Create Property

```
mutation {
  CreateProperty (
    identifier: "2c796031-a303-460a-849d-0be95fb96b03"
    title: "MusicXML File"
    name: "targetFile"
    description: "Select a MusicXML file to be converted to MEI format"
    rangeIncludes: [DigitalDocument]
  ){
    identifier
  }
}
```

### Link the Property to the ControlAction template

```
mutation {
  AddControlActionObject (
    from: {identifier: "78d613b0-1064-4e9c-8f56-9c424d12bad9" }
    to: {identifier: "2c796031-a303-460a-849d-0be95fb96b03" }
  ) {
    from {
      __typename
    }
    to {
      __typename
      ... on Property {
        identifier
      	title
      }
    }
  }
}
```

### Create a PropertyValueSpecification

```
mutation {
  CreatePropertyValueSpecification (
    identifier: "f145799e-9612-43cb-9164-ac2d9ea2f460"
    title: "Result name"
    name: "Result name"
    description: "What name would you like to give the result?"
    defaultValue: ""
    valueMaxLength: 100
    valueMinLength: 4
    multipleValues: false
    valueName: "resultName"
    valuePattern: String
    valueRequired: true
  ) {
    identifier
  }
}
```

### Link the PropertyValueSpecification to the ControlAction template

```
mutation {
  AddControlActionObject (
    from: {identifier: "78d613b0-1064-4e9c-8f56-9c424d12bad9" }
    to: {identifier: "f145799e-9612-43cb-9164-ac2d9ea2f460" }
  ) {
    from {
      __typename
    }
    to {
      __typename
      ... on PropertyValueSpecification {
        identifier
      	title
      }
    }
  }
}
```

### MusicXML DigitalDocuments

```
mutation {
  chopin: CreateDigitalDocument(
    identifier: "0306892c-33d0-4568-81e1-6dac756b042d"
    contributor: "https://videodock.com"
    creator: "Verovio demo admin"
    description: "A sample MusicXML file"
    format: "xml"
    language: en
    source: "https://www.verovio.org/examples/musicxml/Chopin_Etude_Op.10_No.12.xml"
    subject: "Verovio, Demo, Sample"
    title: "Chopin, Etude op. 10 no. 12"
    name: "Chopin, Etude op. 10 no. 12"
  ) {
    identifier
  }
  vivaldi: CreateDigitalDocument(
    identifier: "88aa188a-9d13-41d8-a7c3-2ca48adbadb2"
    contributor: "https://videodock.com"
    creator: "Verovio demo admin"
    description: "A sample MusicXML file"
    format: "xml"
    language: en
    source: "https://www.verovio.org/examples/musicxml/Vivaldi_Concerto_No.4_in_F_Minor_Winter.xml"
    subject: "Verovio, Demo, Sample"
    title: "Vivaldi, Concerto no. 4 in F minor „Winter”"
    name: "Vivaldi, Concerto no. 4 in F minor „Winter”"
  ) {
    identifier
  }
  bach: CreateDigitalDocument(
    identifier: "598f1083-700e-42e4-bc87-a95a925badae"
    contributor: "https://videodock.com"
    creator: "Verovio demo admin"
    description: "A sample MusicXML file"
    format: "xml"
    language: en
    source: "https://www.verovio.org/examples/musicxml/Bach_Nun_komm_der_Heiden_Heiland_BWV.659.xml"
    subject: "Verovio, Demo, Sample"
    title: "Bach, „Nun komm der Heiden Heiland” (arr.) BWV 659"
    name: "Bach, „Nun komm der Heiden Heiland” (arr.) BWV 659"
  ) {
    identifier
  }
}
```

### Request control action

```
mutation {
	RequestControlAction(
		controlAction: {
			entryPointIdentifier: "d7a3b614-4c40-413f-99d6-c0da2c844963"
			potentialActionIdentifier: "78d613b0-1064-4e9c-8f56-9c424d12bad9"
			propertyObject: [
				{
					potentialActionPropertyIdentifier: "2c796031-a303-460a-849d-0be95fb96b03"
					nodeIdentifier: "4679dc75-11e4-41c7-b552-cd710df83dba"
					nodeType: DigitalDocument
				}
			]
			propertyValueObject: [
				{
					potentialActionPropertyValueSpecificationIdentifier: "f145799e-9612-43cb-9164-ac2d9ea2f460"
					value: "Dedham MEI"
					valuePattern: String
				}
			]
		}
	) {
		identifier
		__typename
	}
}
```
