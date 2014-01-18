
code:
	gvim .
	mocha --reporter list --watch

docs:
	cd docs
	docpad generate --env static
	cd ..

lint:
	jshint classes/
	jshint test/
	jshint examples/

setup:
	npm install docpad -g
	npm install jshint -g
	npm install mocha -g
	npm install

site:
	git subtree --prefix docs/out push origin gh-pages

test:
	mocha --reporter list

.PHONY: docs lint setup site test

