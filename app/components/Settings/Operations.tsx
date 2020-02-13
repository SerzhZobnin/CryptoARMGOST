import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  toggleArchivationOperation, toggleEncryptionOperation, toggleSaveCopyToDocuments,
  toggleSigningOperation,
} from "../../AC/settingsActions";
import CheckBoxWithLabel from "../CheckBoxWithLabel";

interface IOperationsProps {
  settings: any;
  toggleSigningOperation: (value: boolean) => void;
  toggleArchivationOperation: (value: boolean) => void;
  toggleEncryptionOperation: (value: boolean) => void;
  toggleSaveCopyToDocuments: (value: boolean) => void;
}

class Operations extends React.Component<IOperationsProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    const { localize, locale } = this.context;
    const { operations } = this.props.settings;
    const { archivation_operation, encryption_operation, save_copy_to_documents, signing_operation } = operations;

    return (
      <div className="row">
        <div className="col s12">
          <CheckBoxWithLabel
            isChecked={signing_operation}
            elementId="sign_operation"
            onClickCheckBox={this.handleSigningOperationClick}
            title={localize("Operations.signing_operation", locale)} />
        </div>
        <div className="col s12">
          <CheckBoxWithLabel
            isChecked={archivation_operation}
            elementId="archivation_operation"
            onClickCheckBox={this.handleArchivationOperationClick}
            title={localize("Operations.archivation_operation", locale)} />
        </div>
        <div className="col s12">
          <CheckBoxWithLabel
            isChecked={encryption_operation}
            elementId="encryption_operation"
            onClickCheckBox={this.handleEncryptionOperationClick}
            title={localize("Operations.encryption_operation", locale)} />
        </div>
        <div className="col s12">
          <CheckBoxWithLabel
            isChecked={save_copy_to_documents}
            elementId="save_copy_to_documents"
            onClickCheckBox={this.handleSaveCopyClick}
            title={localize("Operations.save_copy_to_documents", locale)} />
        </div>
      </div>
    );
  }

  handleSigningOperationClick = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { toggleSigningOperation, settings } = this.props;

    toggleSigningOperation(!settings.operations.signing_operation);
  }

  handleArchivationOperationClick = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { toggleArchivationOperation, settings } = this.props;

    toggleArchivationOperation(!settings.operations.archivation_operation);
  }

  handleEncryptionOperationClick = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { toggleEncryptionOperation, settings } = this.props;

    toggleEncryptionOperation(!settings.operations.encryption_operation);
  }

  handleSaveCopyClick = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { toggleSaveCopyToDocuments, settings } = this.props;

    toggleSaveCopyToDocuments(!settings.operations.save_copy_to_documents);
  }
}

export default connect((state) => {
  return {
    settings: state.settings.getIn(["entities", state.settings.active]),
  };
}, { toggleArchivationOperation, toggleEncryptionOperation, toggleSaveCopyToDocuments, toggleSigningOperation })(Operations);
