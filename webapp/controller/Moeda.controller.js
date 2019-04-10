sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function(Controller, MessageBox) {
	"use strict";

	return Controller.extend("br.com.idxtecMoeda.controller.Moeda", {
		onInit: function(){
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		onRefresh: function(){
			var oModel = this.getOwnerComponent().getModel();
			oModel.refresh(true);
			this.getView().byId("tableMoeda").clearSelection();
		},
		
		onIncluir: function(){
			var oDialog = this._criarDialog();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getModel("view");
			
			oViewModel.setData({
				titulo: "Inserir Moeda",
				msgSalvar: "Moeda inserida com sucesso!",
				codigoEdit: true
			});
			
			oDialog.unbindElement();
			oDialog.setEscapeHandler(function(oPromise){
				if(oModel.hasPendingChanges()){
					oModel.resetChanges();
				}
			});
			
			var oContext = oModel.createEntry("/Moedas",{
				properties: {
					"Codigo": "",
					"Nome": "",
					"Simbolo": ""
				}
			});
			
			oDialog.setBindingContext(oContext);
			oDialog.open();
		},
		
		onEditar: function(){
			var oDialog = this._criarDialog();
			var oTable = this.byId("tableMoeda");
			var nIndex = oTable.getSelectedIndex();
			var oViewModel = this.getModel("view");
			
			oViewModel.setData({
				titulo: "Editar Moeda",
				msgSalvar: "Moeda alterada com sucesso!",
				codigoEdit: false
			});
			
			if(nIndex === -1){
				MessageBox.warning("Selecione uma moeda da tabela!");
				return;
			}
			
			var oContext = oTable.getContextByIndex(nIndex);
			
			oDialog.bindElement(oContext.sPath);
			oDialog.open();
		},
		
		onRemover: function(){
			var that = this;
			var oTable = this.byId("tableMoeda");
			var nIndex = oTable.getSelectedIndex();
			
			if(nIndex === -1){
				MessageBox.warning("Selecione uma moeda da tabela!");
				return;
			}
			
			MessageBox.confirm("Deseja remover essa moeda?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						MessageBox.success("Moeda removido com sucesso!");
						that._remover(oTable, nIndex);
					} 
				}      
			});
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath,{
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				}
			});
		},
		
		_criarDialog: function(){
			var oView = this.getView();
			var oDialog = this.byId("MoedaDialog");
			
			if(!oDialog){
				oDialog = sap.ui.xmlfragment(oView.getId(), "br.com.idxtecMoeda.view.MoedaDialog", this);
				oView.addDependent(oDialog);
			}
			
			return oDialog;
		},
		
		onSaveDialog: function(){
			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getModel("view");
			
			if(this._checarCampos(this.getView()) === true){
				MessageBox.warning("Preencha todos os campos obrigatórios!");
				return;
			} else{
				oModel.submitChanges({
					success: function(oResponse){
						var erro = oResponse.__batchResponses[0].response;
						if(!erro){
							oModel.refresh(true);
							MessageBox.success(oViewModel.getData().msgSalvar);
							oView.byId("MoedaDialog").close();
							oView.byId("tableMoeda").clearSelection(); 
						}
					}
				});
			}
		},
		
		onCloseDialog: function(){
			var oModel = this.getOwnerComponent().getModel();
			
			if(oModel.hasPendingChanges()){
				oModel.resetChanges();
			} 
			this.byId("MoedaDialog").close();
		},
		
		_checarCampos: function(oView){
			if(oView.byId("codigo").getValue() === "" || oView.byId("nome").getValue() === ""
			|| oView.byId("simbolo").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		getModel: function(sModel){
			return this.getOwnerComponent().getModel(sModel);
		}
	});
});