<?php

include_once('Werknemer.php');

class JSonDatabase {

    public function __construct() {
        if (!file_exists('werknemers.dat')) {
            $werknemers[17] = new Werknemer(17, 'Jean', 'Smits');
            $werknemers[23] = new Werknemer(23, 'Fons', 'Leroy');
            $this->setWerknemers($werknemers);
        }
    }

    public function create($werknemer) {
        $werknemers=$this->getWerknemers();
        $hoogsteNummer = max(array_keys($werknemers));
        $nieuwNummer = $hoogsteNummer + 1;
        $werknemer->setNummer($nieuwNummer);
        $werknemers[$nieuwNummer] = $werknemer;
        $this->setWerknemers($werknemers);
        return $nieuwNummer;
    }

    public function read($nummer) {
        $werknemers=$this->getWerknemers();
        if (array_key_exists($nummer, $werknemers)) {
            return $werknemers[$nummer];
        }
        return null;
    }

    public function update($werknemer) {
        $werknemers=$this->getWerknemers();
        $werknemers[$werknemer->getNummer()] = $werknemer;
        $this->setWerknemers($werknemers);
    }

    public function delete($nummer) {
        $werknemers=$this->getWerknemers();
        unset($werknemers[$nummer]);
        $this->setWerknemers($werknemers);
    }

    public function findAll() {
        $werknemers=$this->getWerknemers();
        return array_values($werknemers);
    }

    private function getWerknemers() {
        $objectArray= json_decode(file_get_contents('werknemers.dat'));
        foreach ($objectArray as $object) {
            $werknemer=new Werknemer($object->nummer, $object->voornaam, $object->familienaam);
            $werknemers[$werknemer->getNummer()]=$werknemer;
            }
        return $werknemers;
    }
    
    private function setWerknemers($werknemers) {
         file_put_contents('werknemers.dat', json_encode(array_values($werknemers)));
    }
    
    
}
