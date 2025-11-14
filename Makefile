# Define variables
NODE_ENV = development
NODE_PORT = 5144

update:
	@echo "✨ Mise en état du dossier sur github✨"
	@git add .
	@git commit -m "test"
	@git push
	@echo "✨ Mise à jour terminée✨"
