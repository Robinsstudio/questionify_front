
# OSGI
Pour simplifier, je n'aborde pas ici la configuration des fichiers MANIFEST.MF mais elle est nécessaire pour que les composants fonctionnent. Il faut donc bien penser à exporter les packages des contrats, à les importer dans les fournisseurs et clients. Il faut aussi importer les packages OSGI et éventuellement les packages Swing pour créer des interfaces graphiques.

## Felix
Pour fournir un service, il est nécessaire de définir un contrat qui sera ensuite accessible au fournisseur et au client de ce service.
### Contrat
```java
package service;

public interface Service {
	public void run();
}
```
### Fournisseur
Suite à cela, on définit une implémentation de ce service chez le fournisseur. Cette implémentation est rendue disponible par une classe implémentant l'interface *BundleActivator*.
#### Implémentation du service
```java
package fournisseur;

import service.Service;

public class ServiceImpl implements Service {
	@Override
	public void run() {
		System.out.println("Service has run!");
	}
}
```
#### Classe d'activation
```java
package fournisseur;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

import service.Service;

public class Activator implements BundleActivator {
	@Override
	public void start(BundleContext context) throws Exception {
		//On crée le service et on le met à disposition
		Service service = new ServiceImpl();
		context.registerService(Service.class.getName(), service, null);
		
		System.out.println("Service started!");
	}

	@Override
	public void stop(BundleContext context) throws Exception {
		System.out.println("Service stopped!");
	}
}
```
### Client
Le client, quant à lui, va consommer le service mis à disposition par le fournisseur.

#### Classe d'activation
```java
package client;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;

import service.Service;

public class Activator implements BundleActivator {
	@Override
	public void start(BundleContext context) throws Exception {
		//On récupère le service
		ServiceReference<Service> ref = context.getServiceReference(Service.class);
		Service service = context.getService(ref);

		//On utilise le service
		service.run();
	}
	
	@Override
	public void stop(BundleContext context) throws Exception {
		System.out.println("Client stopped!");
	}
}
```
Le client est minimal ici, se contentant d'une classe d'activation qui utilise le service puis s'arrête. Mais cette dernière pourrait créer une interface graphique qui permettrait d'utiliser le service à la demande de l'utilisateur par exemple.

## Equinox (avec fichiers XML)
En utilisant Equinox, le fournisseur ne nécessite pas de classe d'activation. Des méthodes *activate* et *deactivate* sont définies directement dans l'implémentation du service. Elles sont automatiquement appelées lorsqu'un client utilise le service. En dehors de ces deux méthodes supplémentaires, la classe d'implémentation reste la même et implémente le même contrat que précédemment.
### Fournisseur
#### Implémentation du service
```java
package fournisseur;

import org.osgi.service.component.ComponentContext;

import service.Service;

public class ServiceImpl implements Service {
	@Override
	public void run() {
		System.out.println("Service has run!");
	}
	
	public void activate(ComponentContext context) {
		System.out.println("Service started!");
	}
	
	public void deactivate(ComponentContext context) {
		System.out.println("Service stopped!");
	}
}
```
Ensuite, on déclare le service dans un fichier XML.
#### Définition XML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<scr:component xmlns:scr="http://www.osgi.org/xmlns/scr/v1.1.0" activate="activate" deactivate="deactivate" name="ServiceImpl">
   <implementation class="fournisseur.ServiceImpl"/>
   <service>
      <provide interface="service.Service"/>
   </service>
</scr:component>
```
Tout ce que l'on a définit précédemment y est référencé. Dans la balise `scr:component`, on retrouve nos méthodes *activate* et *deactivate*.

La classe d'implémentation du service est elle déclarée dans la balise `implementation` (attention à ne pas oublier les packages).

Enfin, le service fourni est déclaré dans une balise `provide` au sein d'une `service`. On constate que cette construction permet à notre implémentation de fournir plusieurs services si on le souhaite. Il faudra alors rajouter des balises `provide`.
### Client
Pour le client, on utilise le même principe sauf que l'on va utiliser le service au lieu de le fournir. Comme pour le fournisseur, on définit deux méthodes *activate* et *deactivate*. À ces deux méthodes viennent se rajouter deux méthodes *bind* and *unbind* qui seront appelées automatiquement lorsque le service requis sera rendu disponible puis indisponible.
#### Implémentation du client
```java
package client;

import org.osgi.service.component.ComponentContext;

import service.Service;

public class Client {
	private Service service;
	
	public void activate(ComponentContext context) {
		System.out.println("Client started!");
	}
	
	public void deactivate(ComponentContext context) {
		System.out.println("Client stopped!");
	}
	
	public void bind(Service service) {
		this.service = service;
		service.run();
	}
	
	public void unbind(Service service) {
		this.service = null;
	}
}
```
Pour des raisons de simplicité, le service requis est directement utilisé dans la méthode *bind*. Comme pour le précédent fournisseur, une interface graphique pourrait être créée au démarrage du composant et le service deviendrait accessible dans cette interface lors de l'appel de *bind*. Inversement, il deviendrait indisponible à l'appel de *unbind*.

Contrairement à l'approche précédente, cette approche permet de rendre le service indisponible puis de nouveau disponible sans avoir à redémarrer le client. On pourrait même imaginer que le service soit modifié puis mis à jour et cela serait complètement transparent du point de vue du client.
#### Définition XML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<scr:component xmlns:scr="http://www.osgi.org/xmlns/scr/v1.1.0" activate="activate" deactivate="deactivate" name="Client">
   <implementation class="client.Client"/>
   <reference bind="bind" cardinality="1..1" interface="service.Service" name="Service" policy="dynamic" unbind="unbind"/>
</scr:component>
```
Comme pour le fournisseur, on indique les méthodes *activate*, *deactivate* ainsi que la classe d'implémentation du client.

On utilise une balise `reference` pour indiquer les méthodes *bind* et *unbind* lorsque le service est rendu disponible par le fournisseur. On spécifie également l'interface du contrat comme on l'a fait côté fournisseur.
## Equinox (avec annotations)
Il est également possible d'utiliser des annotations. Dans ce cas, le fichier XML sera automatiquement généré à partir des informations fournies aux annotations. On conserve toujours le même contrat.
### Fournisseur
En ce qui concerne le fournisseur, l'implémentation du service reste la même à l'exception près que l'on rajoute des annotations. On renseigne l'interface du contrat dans une annotation sur la classe d'implémentation et on ajoute deux annotations sur nos méthodes *activate* et *deactivate*.
#### Implémentation du service
```java
package fournisseur;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;

import service.Service;

@Component(service = Service.class)
public class ServiceImpl implements Service {
	@Override
	public void run() {
		System.out.println("Service has run!");
	}
	
	@Activate
	public void activate() {
		System.out.println("Service started!");
	}
	
	@Deactivate
	public void deactivate() {
		System.out.println("Service stopped!");
	}
}
```
C'est tout pour le fournisseur. Le fichier XML est généré automatiquement à partir des annotations de cette classe.
### Client
L'implémentation du client est analogue, en rajoutant une annotation supplémentaire sur la méthode *bind*.
#### Implémentation du client
```java
package client;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferencePolicy;

import service.Service;

@Component
public class Client {
	private Service service;
	
	@Activate
	public void activate() {
		System.out.println("Client started!");
	}
	
	@Deactivate
	public void deactivate() {
		System.out.println("Client stopped!");
	}
	
	@Reference(service = Service.class, unbind = "unbind", policy = ReferencePolicy.DYNAMIC)
	public void bind(Service service) {
		this.service = service;
		service.run();
	}
	
	public void unbind(Service service) {
		this.service = null;
	}
}
```
On utilise une annotation `reference` à laquelle on donne l'interface du contrat ainsi que le nom de la méthode *unbind*. Il est important de renseigner le service car cette classe pourrait en utiliser plusieurs. Il faudrait donc des *bind* pour chacun des services requis. Le champ *policy* est en revanche optionnel et a pour valeur static par défaut.

C'est tout pour le client. Le fichier XML est généré automatiquement comme pour le fournisseur. Cette dernière approche par annotations est beaucoup plus rapide à mettre en place que les deux précédentes.